'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function MediaUploader({ btnClassName, clientId }: { btnClassName?: string, clientId?: string }) {
    const [uploading, setUploading] = useState(false)
    const router = useRouter()

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('[MediaUploader] File selected', e.target.files)
        console.log('[MediaUploader] Current Client ID:', clientId)

        if (!e.target.files || e.target.files.length === 0) return

        // Debugging: Allow request even if clientId missing to see server logs
        if (!clientId) {
            alert('Error: No client selected (ID is missing)')
            return
        }

        setUploading(true)
        const formData = new FormData()
        formData.append('clientId', clientId)
        Array.from(e.target.files).forEach((file) => {
            formData.append('files', file) // Changed to 'files' to match API
        })

        try {
            console.log('[MediaUploader] Sending POST request...')
            const res = await fetch('/api/upload/ingest', {
                method: 'POST',
                body: formData,
            })

            console.log('[MediaUploader] Response status:', res.status)
            const json = await res.json()
            console.log('[MediaUploader] Response JSON:', json)

            // Alert for debugging
            if (json.results && json.results.length > 0) {
                const first = json.results[0]
                if (first.status !== 'assigned' && first.status !== 'uploaded') {
                    alert(`Server reported error: ${JSON.stringify(first)}`)
                } else {
                    alert(`Success! Status: ${first.status} (Screen: ${first.screen || 'None'})`)
                }
            } else {
                alert('Uploaded, but no results returned?')
            }

            if (!res.ok) throw new Error(json.error || 'Upload failed')

            // Refresh logic could be better, but simple full refresh works for now for lists
            router.refresh()
        } catch (error: any) {
            console.error('[MediaUploader] Error:', error)
            alert(`Upload failed: ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="relative inline-block group">
            <button disabled={uploading} className={btnClassName}>
                {uploading ? 'Uploading...' : 'Upload Media'}
            </button>
            <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer disabled:cursor-not-allowed"
            />
        </div>
    )
}
