'use client';

import { useState } from 'react';
import { SignedImage } from '@/components/ui/signed-image';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteMediaAsset } from './actions';

interface MediaItemProps {
    asset: {
        id: string;
        storage_path: string;
        filename: string;
        bytes?: number;
    };
}

export function MediaItem({ asset }: MediaItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) return;

        setIsDeleting(true);
        const result = await deleteMediaAsset(asset.id, asset.storage_path);

        if (!result.success) {
            alert('Failed to delete: ' + result.error);
            setIsDeleting(false);
        }
    };

    return (
        <div className="group relative aspect-square bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200">
            <SignedImage path={asset.storage_path} alt={asset.filename} className="w-full h-full object-cover" />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
                <span className="text-xs font-medium truncate max-w-[90%] px-2 text-center">
                    {asset.filename}
                </span>
                <span className="text-xs text-zinc-300">
                    {Math.round((asset.bytes || 0) / 1024)} KB
                </span>

                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="mt-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors disabled:opacity-50"
                    title="Delete"
                >
                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
            </div>
        </div>
    );
}
