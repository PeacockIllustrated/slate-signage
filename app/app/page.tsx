import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'
import { CreateClientButton } from '@/components/admin/create-client-button'

async function DashboardContent() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    const role = profile?.role || 'client_admin'

    // If super_admin, show all clients
    if (role === 'super_admin') {
        const { data: clients } = await supabase.from('clients').select('*, stores(count)').order('created_at', { ascending: false })

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
                    <CreateClientButton />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {clients?.map((client) => (
                        <Link href={`/app/clients/${client.id}`} key={client.id} className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-black transition-colors shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{client.slug}</p>
                            <div className="mt-4 flex items-center text-sm text-gray-500">
                                <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                                    {client.stores?.[0]?.count ?? 0} Stores
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )
    }

    // Client Admin View
    const { data: stores } = await supabase.from('stores').select('*, screen_sets(count)').eq('client_id', profile?.client_id).order('name')

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stores?.map((store) => (
                    <Link href={`/app/stores/${store.id}`} key={store.id} className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-black transition-colors shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900">{store.name}</h3>
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                            <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                                {store.screen_sets?.[0]?.count ?? 0} Screen Sets
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    )
}
