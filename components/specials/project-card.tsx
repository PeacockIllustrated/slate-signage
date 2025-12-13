'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { deleteSpecialsProject } from '@/app/app/specials/actions';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
    project: any;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm('Are you sure you want to delete this special?')) return;

        try {
            await deleteSpecialsProject(project.id);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete:', error);
            alert('Failed to delete project');
        }
    };

    return (
        <Link href={`/app/specials/${project.id}`} className="block group relative">
            <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                    {project.thumbnail_url ? (
                        <img
                            src={project.thumbnail_url}
                            alt={project.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-gray-400 text-sm">{project.canvas_preset}</div>
                    )}

                    {project.last_published_media_asset_id && (
                        <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full shadow-sm z-10">
                            Published
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="overflow-hidden">
                            <h3 className="font-semibold group-hover:text-blue-600 truncate">{project.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">Updated {new Date(project.updated_at).toLocaleDateString('en-US')}</p>
                        </div>
                        <button
                            onClick={handleDelete}
                            className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
