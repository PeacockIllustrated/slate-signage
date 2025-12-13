import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SignedImage } from '@/components/ui/signed-image'
import { RefreshButton } from '@/components/portal/refresh-button'
import { CreateScreenButton } from '@/components/admin/create-screen-button'

export default async function ScreenSetPage({ params }: { params: Promise<{ setId: string }> }) {
    const { setId } = await params
    const supabase = await createClient()

    const { data: screenSet } = await supabase.from('screen_sets').select('*, store:stores(id, name)').eq('id', setId).single()
    if (!screenSet) return notFound()

    // Auth check loose
    const { data: { user } } = await supabase.auth.getUser()
    // We could fetch role here if we want to conditionally hide, but for now we show it.

    // Fetch Screens with their active content
    const { data: screens } = await supabase
        .from('screens')
        .select(`
        *,
        screen_content(
            media_asset:media_assets(*)
        )
    `)
        .eq('screen_set_id', setId)
        .eq('screen_content.active', true)
        .order('name', { ascending: true })

    // Group screens
    const landscapeScreens = screens?.filter(s => s.orientation !== 'portrait') || []
    const portraitScreens = screens?.filter(s => s.orientation === 'portrait') || []

    const ScreenCard = ({ screen }: { screen: any }) => {
        const activeMedia = Array.isArray(screen.screen_content) ? screen.screen_content[0]?.media_asset : screen.screen_content?.media_asset
        return (
            <div
                className={cn(
                    "relative bg-white border-2 border-transparent hover:border-black transition-all shadow-sm rounded-lg overflow-hidden flex flex-col group",
                    screen.orientation === 'portrait' ? "aspect-[9/16]" : "aspect-video",
                )}
            >
                <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {screen.name}
                    <span className="ml-2 opacity-75">{screen.display_type}</span>
                </div>

                <div className="flex-1 bg-gray-800 flex items-center justify-center relative">
                    {activeMedia ? (
                        <SignedImage path={activeMedia.storage_path} alt="Screen Content" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-gray-500 text-sm">No Content</div>
                    )}
                </div>

                <div className="p-3 bg-white border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                    <span>{screen.orientation}</span>
                    <span className={cn("w-2 h-2 rounded-full", screen.last_seen_at ? "bg-green-500" : "bg-red-500")} />
                </div>

                <Link href={`/app/screens/${screen.id}`} className="absolute inset-0 z-20" aria-label={`Manage ${screen.name}`} />
            </div>
        )
    }

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 flex-shrink-0">
                <div>
                    <Link href={`/app/stores/${screenSet.store?.id}`} className="text-sm text-gray-500 hover:text-gray-900 mb-1 block">&larr; {screenSet.store?.name}</Link>
                    <h1 className="text-2xl font-bold text-gray-900">{screenSet.name}</h1>
                </div>
                <div className="flex space-x-3 w-full md:w-auto">
                    <RefreshButton screenSetId={setId} />
                    <CreateScreenButton screenSetId={setId} />
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-gray-100 p-4 md:p-8 rounded-lg border border-dashed border-gray-300 space-y-8">

                {portraitScreens.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Portrait Screens</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {portraitScreens.map(screen => <ScreenCard key={screen.id} screen={screen} />)}
                        </div>
                    </div>
                )}

                {landscapeScreens.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Landscape Screens</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {landscapeScreens.map(screen => <ScreenCard key={screen.id} screen={screen} />)}
                        </div>
                    </div>
                )}

                {screens?.length === 0 && (
                    <div className="text-center text-gray-500 py-12">No screens in this set.</div>
                )}
            </div>
        </div >
    )
}
