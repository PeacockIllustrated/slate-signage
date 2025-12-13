'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSpecialsProject } from '@/app/app/specials/actions';
import { TEMPLATES } from '@/components/specials/Templates';
import { Loader2 } from 'lucide-react';
import { ClientSelector } from '@/components/portal/client-selector';
import { Suspense } from 'react';

interface Props {
    clients?: { id: string; name: string }[];
    userClientId?: string; // If Client Admin, this is their ID. If Super Admin, this is undefined.
}

export function NewSpecialView({ clients = [], userClientId }: Props) {
    return (
        <Suspense fallback={<div className="p-8">Loading...</div>}>
            <Content clients={clients} userClientId={userClientId} />
        </Suspense>
    );
}

function Content({ clients, userClientId }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [submitting, setSubmitting] = useState(false);

    // Determine effective Client ID
    // 1. URL Param (highest priority)
    // 2. User's Client ID (if client admin)
    // 3. First available client (if super admin fallback)
    const urlClientId = searchParams.get('clientId');
    const effectiveClientId = urlClientId || userClientId || clients[0]?.id;

    const handleCreate = async (template: any) => {
        if (!effectiveClientId) {
            alert('Please select a client first.');
            return;
        }

        setSubmitting(true);
        try {
            const projectId = await createSpecialsProject(
                effectiveClientId,
                `${template.name} Copy`,
                template.canvas_preset,
                template.design_json
            );

            router.push(`/app/specials/${projectId}`);
        } catch (e: any) {
            console.error(e);
            alert(`Failed to create project: ${e.message}`);
            setSubmitting(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Create New Special</h1>
                    <p className="text-gray-500">Choose a template or start from scratch</p>
                </div>

                {/* Show Client Selector if multiple clients available (Super Admin) */}
                {clients.length > 0 && (
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Creating for Client:</label>
                        <ClientSelector clients={clients} activeClientId={effectiveClientId} />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Blank Landscape */}
                <button
                    disabled={submitting}
                    onClick={() => handleCreate({ name: 'Landscape', canvas_preset: 'landscape_1080', design_json: { nodes: [], backgroundColor: '#ffffff' } })}
                    className="border rounded-lg p-6 hover:border-black text-left flex flex-col items-center justify-center aspect-[16/9] bg-white"
                >
                    <div className="w-24 h-16 border-2 border-dashed border-gray-300 mb-4 bg-gray-50"></div>
                    <span className="font-semibold">Blank Landscape</span>
                    <span className="text-xs text-gray-400">1920 x 1080</span>
                </button>

                {/* Blank Portrait */}
                <button
                    disabled={submitting}
                    onClick={() => handleCreate({ name: 'Portrait', canvas_preset: 'portrait_1080', design_json: { nodes: [], backgroundColor: '#ffffff' } })}
                    className="border rounded-lg p-6 hover:border-black text-left flex flex-col items-center justify-center aspect-[9/16] bg-white"
                >
                    <div className="w-12 h-20 border-2 border-dashed border-gray-300 mb-4 bg-gray-50"></div>
                    <span className="font-semibold">Blank Portrait</span>
                    <span className="text-xs text-gray-400">1080 x 1920</span>
                </button>

                {TEMPLATES.map((tmpl, i) => (
                    <button
                        key={i}
                        disabled={submitting}
                        onClick={() => handleCreate(tmpl)}
                        className="border rounded-lg p-4 hover:border-black text-left transition-colors bg-white group"
                    >
                        <div className="bg-gray-100 rounded mb-4 aspect-video flex items-center justify-center text-gray-400 text-xs overflow-hidden relative">
                            {/* Placeholder for template preview */}
                            <div className="absolute inset-0 bg-gray-200 group-hover:bg-gray-300 transition-colors" />
                            <span className="relative z-10">Preview</span>
                        </div>
                        <h3 className="font-medium">{tmpl.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{tmpl.canvas_preset}</p>
                    </button>
                ))}
            </div>

            {submitting && (
                <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50">
                    <Loader2 className="animate-spin" size={32} />
                </div>
            )}
        </div>
    );
}
