import { createClient } from '@/lib/supabase/server'
import { CreateScheduleButton } from '@/components/admin/create-schedule-button'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function SchedulesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: role } = await supabase.from('profiles').select('client_id, role').eq('id', user.id).single()

    // Fetch Stores for dropdown
    let storeQuery = supabase.from('stores').select('id, name').order('name')
    if (role?.role !== 'super_admin' && role?.client_id) {
        storeQuery = storeQuery.eq('client_id', role.client_id)
    }
    const { data: stores } = await storeQuery

    // Fetch Schedules
    const { data: schedules } = await supabase
        .from('schedules')
        .select(`
            *,
            store:stores(name)
        `)
        .order('created_at', { ascending: false })
        .limit(20)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Schedules</h1>
                <CreateScheduleButton stores={stores || []} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {schedules?.map((schedule) => (
                    <Link href={`/app/schedules/${schedule.id}`} key={schedule.id} className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-black transition-colors shadow-sm group">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 group-hover:text-black">{schedule.name}</h3>
                                <p className="text-sm text-gray-500">{schedule.store?.name}</p>
                            </div>
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                            </span>
                        </div>
                        <div className="mt-4 flex gap-1 flex-wrap">
                            {/* Small Day Indicators */}
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <span key={i} className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${schedule.days_of_week.includes(i) ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    {d}
                                </span>
                            ))}
                        </div>
                    </Link>
                ))}
                {schedules?.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        No schedules found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
