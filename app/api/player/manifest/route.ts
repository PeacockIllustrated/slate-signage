import { createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
    // ... params handling ...
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
        return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // 1. Find Screen by Token
    const { data: screen } = await supabase
        .from('screens')
        .select('id, store_id, refresh_version')
        .eq('player_token', token)
        .single()

    if (!screen) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // 2. Resolve Content (Server-Side Logic)
    // We call the Postgres function resolve_screen_media
    const { data: mediaId } = await supabase
        .rpc('resolve_screen_media', {
            p_screen_id: screen.id,
            p_now: new Date().toISOString()
        })

    let mediaUrl = null
    let mimeType = null

    if (mediaId) {
        const { data: media } = await supabase
            .from('media_assets')
            .select('storage_path, mime')
            .eq('id', mediaId)
            .single()

        if (media) {
            // Generate Signed URL
            const { data: signed } = await supabase
                .storage
                .from('slate-media')
                .createSignedUrl(media.storage_path, 3600) // 1 Hour

            if (signed) {
                mediaUrl = signed.signedUrl
                mimeType = media.mime
            }
        }
    }

    // 3. Calculate "Next Check" Time (Optimization)
    const now = new Date()
    const currentTimeVal = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
    const currentDow = now.getDay()

    // Fetch relevant schedules for this screen
    const { data: scheds } = await supabase
        .from('scheduled_screen_content')
        .select(`
            schedule:schedules (
                start_time,
                end_time,
                days_of_week
            )
        `)
        .eq('screen_id', screen.id)

    let nextChange: Date | null = null

    if (scheds) {
        let minDiff = Infinity

        const toSeconds = (t: string) => {
            const [h, m, s] = t.split(':').map(Number)
            return h * 3600 + m * 60 + (s || 0)
        }

        scheds.forEach((item: any) => {
            const s = item.schedule
            if (!s || !s.days_of_week.includes(currentDow)) return

            const start = toSeconds(s.start_time)
            const end = toSeconds(s.end_time)

            // Check Start Time
            if (start > currentTimeVal) {
                const diff = start - currentTimeVal
                if (diff < minDiff) minDiff = diff
            }

            // Check End Time
            if (end > currentTimeVal) {
                const diff = end - currentTimeVal
                if (diff < minDiff) minDiff = diff
            }
        })

        if (minDiff !== Infinity) {
            nextChange = new Date(now.getTime() + minDiff * 1000)
        }
    }

    return NextResponse.json({
        screen_id: screen.id,
        refresh_version: screen.refresh_version,
        media: {
            id: mediaId,
            url: mediaUrl,
            type: mimeType
        },
        next_check: nextChange ? nextChange.toISOString() : null,
        fetched_at: new Date().toISOString()
    })
}
