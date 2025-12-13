'use client'

import { useState } from 'react'
import { updateSchedule, deleteSchedule } from '@/app/actions/update-schedule'
import { useRouter } from 'next/navigation'

const DAYS = [
    { id: 0, label: 'Sun' },
    { id: 1, label: 'Mon' },
    { id: 2, label: 'Tue' },
    { id: 3, label: 'Wed' },
    { id: 4, label: 'Thu' },
    { id: 5, label: 'Fri' },
    { id: 6, label: 'Sat' },
]

type Schedule = {
    id: string
    name: string
    start_time: string
    end_time: string
    days_of_week: number[]
}

export function EditScheduleForm({ schedule }: { schedule: Schedule }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleUpdate = async (formData: FormData) => {
        setLoading(true)
        try {
            await updateSchedule(schedule.id, formData)
            alert('Schedule updated')
        } catch (e: any) {
            alert(e.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this schedule?')) return
        try {
            await deleteSchedule(schedule.id)
            router.push('/app/schedules')
        } catch (e: any) {
            alert(e.message)
        }
    }

    return (
        <form action={handleUpdate} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Name</label>
                <input
                    name="name"
                    type="text"
                    defaultValue={schedule.name}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Days Active</label>
                <div className="flex flex-wrap gap-2">
                    {DAYS.map(day => (
                        <label key={day.id} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded border border-gray-200 cursor-pointer hover:border-gray-400">
                            <input
                                type="checkbox"
                                name="days"
                                value={day.id}
                                defaultChecked={schedule.days_of_week.includes(day.id)}
                                className="rounded text-black focus:ring-black"
                            />
                            <span className="text-sm text-gray-700">{day.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                        name="startTime"
                        type="time"
                        defaultValue={schedule.start_time}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                        name="endTime"
                        type="time"
                        defaultValue={schedule.start_time.split(':').length === 3 ? schedule.end_time : schedule.end_time + ':00'}
                        // Note: Postgres TIME might return HH:MM:SS or HH:MM. Default value usually handles it but being safe.
                        // Actually standard input time expects HH:MM, Postgres often gives HH:MM:SS.
                        // Let's safe slice.
                        key={schedule.end_time} // Force re-render if needed
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black sm:text-sm"
                        required
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-gray-100 mt-6">
                <button
                    type="button"
                    onClick={handleDelete}
                    className="text-red-600 text-sm hover:text-red-800 font-medium"
                >
                    Delete Schedule
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 font-medium disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    )
}
