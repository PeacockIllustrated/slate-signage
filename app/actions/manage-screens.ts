'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ... (imports)

export async function addScreen(formData: FormData) {
    const supabase = await createClient()

    // 1. Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // 2. Parse Data
    const screenSetId = formData.get('screen_set_id') as string
    const name = formData.get('name') as string
    const orientation = formData.get('orientation') as string || 'landscape'
    const displayType = formData.get('display_type') as string || 'pc'

    if (!screenSetId || !name) {
        throw new Error('Missing required fields')
    }

    // 3. Fetch Context & Check Permissions
    const { data: screenSet } = await supabase.from('screen_sets')
        .select('*, store:stores(client_id)')
        .eq('id', screenSetId)
        .single()

    if (!screenSet) throw new Error('Screen Set not found')

    const { data: profile } = await supabase.from('profiles').select('role, client_id').eq('id', user.id).single()

    // @ts-ignore - Supabase types might not infer the join perfectly
    const storeClientId = screenSet.store?.client_id
    const isSuperAdmin = profile?.role === 'super_admin'
    const isClientAdmin = profile?.role === 'client_admin' && profile.client_id === storeClientId

    if (!isSuperAdmin && !isClientAdmin) {
        throw new Error('Forbidden: Insufficient permissions')
    }

    // 4. Insert Screen
    const token = `token-${Math.random().toString(36).substring(2, 10)}`

    const { error } = await supabase.from('screens').insert({
        screen_set_id: screenSetId,
        store_id: screenSet.store_id,
        name,
        orientation,
        display_type: displayType,
        player_token: token,
        index_in_set: 99
    })

    if (error) {
        console.error('Failed to add screen:', error)
        throw new Error(error.message || 'Failed to add screen')
    }

    revalidatePath(`/app/screen-sets/${screenSetId}`)
}

export async function updateScreen(screenId: string, formData: FormData) {
    const supabase = await createClient()

    // 1. Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // 2. Fetch Screen & Context
    const { data: screen } = await supabase.from('screens')
        .select('*, store:stores(client_id)')
        .eq('id', screenId)
        .single()

    if (!screen) throw new Error('Screen not found')

    // 3. Check Permissions
    const { data: profile } = await supabase.from('profiles').select('role, client_id').eq('id', user.id).single()

    // @ts-ignore
    const storeClientId = screen.store?.client_id
    const isSuperAdmin = profile?.role === 'super_admin'
    const isClientAdmin = profile?.role === 'client_admin' && profile.client_id === storeClientId

    if (!isSuperAdmin && !isClientAdmin) {
        throw new Error('Forbidden: Insufficient permissions')
    }

    // 4. Update
    const name = formData.get('name') as string
    const orientation = formData.get('orientation') as string
    const displayType = formData.get('display_type') as string

    const { error } = await supabase.from('screens').update({
        name,
        orientation,
        display_type: displayType
    }).eq('id', screenId)

    if (error) {
        console.error('Failed to update screen:', error)
        throw new Error('Failed to update screen')
    }

    revalidatePath(`/app/screens/${screenId}`)
}

export async function deleteScreen(screenId: string, screenSetId: string) {
    const supabase = await createClient()

    // 1. Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // 2. Fetch Screen & Context
    const { data: screen } = await supabase.from('screens')
        .select('*, store:stores(client_id)')
        .eq('id', screenId)
        .single()

    if (!screen) throw new Error('Screen not found')

    // 3. Check Permissions
    const { data: profile } = await supabase.from('profiles').select('role, client_id').eq('id', user.id).single()

    // @ts-ignore
    const storeClientId = screen.store?.client_id
    const isSuperAdmin = profile?.role === 'super_admin'
    const isClientAdmin = profile?.role === 'client_admin' && profile.client_id === storeClientId

    if (!isSuperAdmin && !isClientAdmin) {
        throw new Error('Forbidden: Insufficient permissions')
    }

    // 4. Delete
    const { error } = await supabase.from('screens').delete().eq('id', screenId)

    if (error) {
        console.error('Failed to delete screen:', error)
        throw new Error('Failed to delete screen')
    }

    revalidatePath(`/app/screen-sets/${screenSetId}`)
    redirect(`/app/screen-sets/${screenSetId}`)
}
