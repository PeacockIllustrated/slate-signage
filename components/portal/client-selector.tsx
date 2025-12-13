'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function ClientSelector({ clients }: { clients: { id: string, name: string }[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentClientId = searchParams.get('clientId') || (clients.length > 0 ? clients[0].id : '')

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.push(`/app/media?clientId=${e.target.value}`)
    }

    if (clients.length === 0) return null

    return (
        <select
            value={currentClientId}
            onChange={handleChange}
            className="block w-[200px] rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        >
            {clients.map((client) => (
                <option key={client.id} value={client.id}>
                    {client.name}
                </option>
            ))}
        </select>
    )
}
