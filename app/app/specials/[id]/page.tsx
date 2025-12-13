'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { notFound, useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { SpecialsProject, SpecialNode, CANVAS_PRESETS } from '@/components/specials/types';
import { updateSpecialsProject, deleteSpecialsProject, publishSpecialThumbnail } from '../actions';
import { LayersPanel } from '@/components/specials/LayersPanel';
import { PropertiesPanel } from '@/components/specials/PropertiesPanel';
import { Loader2, ArrowLeft, Save, Upload, Type, Image as ImageIcon, Square, Circle, Undo, Redo, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { EDITOR_FONTS } from '@/components/specials/fonts';

// Dynamically import Editor to avoid SSR issues with Konva
const Editor = dynamic(() => import('@/components/specials/Editor'), {
    ssr: false,
    loading: () => <div className="flex-1 flex items-center justify-center bg-gray-100">Loading Editor...</div>
});

const MAX_HISTORY = 20;

export default function EditSpecialPage() {
    const { id } = useParams();
    const router = useRouter();
    const [project, setProject] = useState<SpecialsProject | null>(null);
    const [projectName, setProjectName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Node State & History
    const [nodes, setNodes] = useState<SpecialNode[]>([]);
    const [history, setHistory] = useState<SpecialNode[][]>([]);
    const [historyStep, setHistoryStep] = useState(0);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const editorRef = useRef<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchProject = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('specials_projects')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                console.error(error);
            } else {
                setProject(data);
                setProjectName(data.name);
                const initialNodes = data.design_json?.nodes || [];
                setNodes(initialNodes);
                setHistory([initialNodes]);
                setHistoryStep(0);
            }
            setLoading(false);
        };
        fetchProject();
    }, [id]);

    // History Helpers
    const pushToHistory = useCallback((newNodes: SpecialNode[]) => {
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(newNodes);
        if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
        }
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
        setNodes(newNodes);
    }, [history, historyStep]);

    const handleUndo = useCallback(() => {
        if (historyStep === 0) return;
        const newStep = historyStep - 1;
        setHistoryStep(newStep);
        setNodes(history[newStep]);
    }, [historyStep, history]);

    const handleRedo = useCallback(() => {
        if (historyStep === history.length - 1) return;
        const newStep = historyStep + 1;
        setHistoryStep(newStep);
        setNodes(history[newStep]);
    }, [historyStep, history]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    handleRedo();
                } else {
                    handleUndo();
                }
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                handleRedo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo]);


    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length || !project) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('clientId', project.client_id);
        formData.append('files', file);

        setSaving(true);
        try {
            const res = await fetch('/api/upload/ingest', {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error('Upload failed');
            const json = await res.json();
            const result = json.results?.[0];

            if (result && result.publicUrl) {
                const newNode = {
                    id: uuidv4(),
                    type: 'image' as const,
                    x: 100,
                    y: 100,
                    src: result.publicUrl,
                    width: 300,
                    height: 300
                };
                pushToHistory([...nodes, newNode]);
                setSelectedId(newNode.id);
            } else {
                alert('Upload success but failed to get URL');
            }
        } catch (err: any) {
            console.error(err);
            alert('Image upload failed');
        } finally {
            setSaving(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSave = async () => {
        if (!project || !editorRef.current) return;
        setSaving(true);
        try {
            // 1. Generate Thumbnail
            const stage = editorRef.current.getStage();
            let thumbnailUrl = project.thumbnail_url;

            if (stage) {
                // Temporarily unselect to hide transformer
                const prevSelected = selectedId;
                setSelectedId(null);
                await new Promise(r => setTimeout(r, 50));

                // Calculate ratio for a width of 400px thumbnail
                const preset = CANVAS_PRESETS[project.canvas_preset as keyof typeof CANVAS_PRESETS];
                const targetWidth = 400;
                // We want final image width to be 400.
                // Current stage width is (preset.width * stage.scaleX()).
                // pixelRatio * (stage.width()) = 400
                // pixelRatio = 400 / (stage.width())
                const pixelRatio = targetWidth / (stage.width());

                const dataUrl = stage.toDataURL({
                    pixelRatio: pixelRatio,
                    mimeType: 'image/jpeg',
                    quality: 0.8
                });

                // Restore selection
                setSelectedId(prevSelected);

                const res = await fetch(dataUrl);
                const blob = await res.blob();
                const file = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });

                const supabase = createClient();
                const path = `${project.client_id}/thumbnails/${project.id}.jpg`;

                const { error: uploadError } = await supabase.storage
                    .from('slate-media')
                    .upload(path, file, { upsert: true });

                if (uploadError) {
                    console.warn('Thumbnail upload failed:', uploadError);
                } else {
                    const { data: { publicUrl } } = supabase.storage
                        .from('slate-media')
                        .getPublicUrl(path);
                    thumbnailUrl = publicUrl;
                }
            }

            // 2. Save Project
            const designJson = {
                ...project.design_json,
                nodes: nodes
            };

            await updateSpecialsProject(project.id, {
                name: projectName,
                design_json: designJson,
                thumbnail_url: thumbnailUrl
            });

        } catch (e) {
            console.error(e);
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!project) return;
        if (!confirm('Are you sure you want to delete this specific project? This cannot be undone.')) return;
        setSaving(true);
        try {
            await deleteSpecialsProject(project.id);
            router.push('/app/specials');
        } catch (e: any) {
            console.error(e);
            alert('Failed to delete project: ' + e.message);
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!project || !editorRef.current) return;
        if (!confirm('This will create a new media asset and upload it. Continue?')) return;
        setSaving(true);
        try {
            const stage = editorRef.current.getStage();
            if (!stage) throw new Error("Stage not found");

            const prevSelected = selectedId;
            setSelectedId(null);
            await new Promise(r => setTimeout(r, 100));

            // EXPORT FULL RESOLUTION strategy: Unscale stage temporarily
            const preset = CANVAS_PRESETS[project.canvas_preset as keyof typeof CANVAS_PRESETS];

            const oldScale = stage.scaleX();
            const oldWidth = stage.width();
            const oldHeight = stage.height();

            // Set to natural size (1:1)
            stage.scale({ x: 1, y: 1 });
            stage.width(preset.width);
            stage.height(preset.height);
            // Redraw to ensure updates applied
            stage.batchDraw();

            const dataUrl = stage.toDataURL({
                pixelRatio: 1, // 1:1 export
                mimeType: 'image/png'
            });

            // Restore editor scale
            stage.scale({ x: oldScale, y: oldScale });
            stage.width(oldWidth);
            stage.height(oldHeight);
            stage.batchDraw();

            setSelectedId(prevSelected);

            const res = await fetch(dataUrl);
            const blob = await res.blob();
            const filename = `special-${projectName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
            const file = new File([blob], filename, { type: 'image/png' });

            // Upload Logic via Server Action (Bypasses RLS)
            const formData = new FormData();
            formData.append('file', file);
            formData.append('clientId', project.client_id);
            formData.append('filename', filename);
            formData.append('duration', '10');

            await publishSpecialThumbnail(formData);

            // Update Project
            const designJson = { ...project.design_json, nodes: nodes };
            await updateSpecialsProject(project.id, {
                name: projectName,
                design_json: designJson
            });

            alert('Published successfully! The image is available in your Media Library.');

        } catch (e: any) {
            console.error(e);
            alert(`Publish failed: ${e.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleAddNode = (newNode: SpecialNode) => {
        pushToHistory([...nodes, newNode]);
        setSelectedId(newNode.id);
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!project) return <div>Project not found</div>;

    const presetName = project?.canvas_preset || 'landscape_1080';
    const presetDimensions = CANVAS_PRESETS[presetName as keyof typeof CANVAS_PRESETS] || CANVAS_PRESETS.landscape_1080;
    const selectedNode = nodes.find(n => n.id === selectedId) || null;

    return (
        <div className="h-screen flex flex-col">
            <style jsx global>{`
                ${EDITOR_FONTS.map(font => `@import url('${font.url}');`).join('\n')}
            `}</style>

            {/* Header */}
            <div className="h-14 border-b flex items-center justify-between px-4 bg-white z-10 shrink-0">
                <div className="flex items-center gap-4 flex-1">
                    <Link href="/app/specials" className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-3 flex-1 max-w-md">
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            onBlur={handleSave}
                            className="font-bold text-xl text-zinc-900 bg-transparent hover:bg-zinc-50 focus:bg-white border border-transparent focus:border-zinc-200 rounded px-2 py-0.5 outline-none transition-all w-full"
                        />
                        <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-1 rounded font-medium border border-zinc-200 whitespace-nowrap">
                            {project?.canvas_preset === 'portrait_1080' ? '1080x1920' : '1920x1080'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1 mx-4">
                    <button onClick={handleUndo} disabled={historyStep === 0} title="Undo (Ctrl+Z)" className="p-2 hover:bg-zinc-100 rounded text-zinc-600 disabled:opacity-30">
                        <Undo size={18} />
                    </button>
                    <button onClick={handleRedo} disabled={historyStep === history.length - 1} title="Redo (Ctrl+Shift+Z)" className="p-2 hover:bg-zinc-100 rounded text-zinc-600 disabled:opacity-30">
                        <Redo size={18} />
                    </button>
                    <div className="w-px h-6 bg-zinc-200 mx-1"></div>
                    <button onClick={handleDeleteProject} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded" title="Delete Project">
                        <Trash2 size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={saving}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-black hover:bg-zinc-800 rounded-md transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        Publish
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-64 border-r bg-white flex flex-col shrink-0">
                    <div className="p-3 border-b">
                        <h3 className="font-semibold text-sm text-zinc-900">Layers</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <LayersPanel
                            nodes={nodes}
                            selectedId={selectedId}
                            onSelect={setSelectedId}
                            onDelete={(id) => {
                                pushToHistory(nodes.filter(n => n.id !== id));
                                if (selectedId === id) setSelectedId(null);
                            }}
                            onDuplicate={(id) => {
                                const node = nodes.find(n => n.id === id);
                                if (node) {
                                    const newNode = { ...node, id: uuidv4(), x: node.x + 20, y: node.y + 20 };
                                    pushToHistory([...nodes, newNode]);
                                    setSelectedId(newNode.id);
                                }
                            }}
                            onReorder={() => { }}
                            onMoveLayer={(id, dir) => {
                                const idx = nodes.findIndex(n => n.id === id);
                                if (idx === -1) return;
                                const newNodes = [...nodes];
                                if (dir === 'up' && idx < newNodes.length - 1) {
                                    [newNodes[idx], newNodes[idx + 1]] = [newNodes[idx + 1], newNodes[idx]];
                                } else if (dir === 'down' && idx > 0) {
                                    [newNodes[idx], newNodes[idx - 1]] = [newNodes[idx - 1], newNodes[idx]];
                                }
                                pushToHistory(newNodes);
                            }}
                        />
                    </div>

                    {/* Toolbar */}
                    {/* Toolbar */}
                    <div className="p-3 border-t bg-zinc-50 grid grid-cols-4 gap-2">
                        <button onClick={() => {
                            pushToHistory([...nodes, {
                                id: uuidv4(),
                                type: 'text',
                                x: 100, y: 100,
                                text: 'Double click to edit',
                                fontSize: 40,
                                fontFamily: 'Inter',
                                fill: '#000000',
                                width: 300
                            }]);
                        }} className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white hover:shadow-sm transition-all text-zinc-600">
                            <Type size={20} />
                            <span className="text-[10px]">Text</span>
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white hover:shadow-sm transition-all text-zinc-600">
                            <ImageIcon size={20} />
                            <span className="text-[10px]">Image</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <button onClick={() => {
                            pushToHistory([...nodes, {
                                id: uuidv4(),
                                type: 'rect',
                                x: 150, y: 150,
                                width: 200, height: 200,
                                fill: '#e4e4e7'
                            }]);
                        }} className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white hover:shadow-sm transition-all text-zinc-600">
                            <Square size={20} />
                            <span className="text-[10px]">Rect</span>
                        </button>
                        <button onClick={() => {
                            pushToHistory([...nodes, {
                                id: uuidv4(),
                                type: 'circle',
                                x: 250, y: 250,
                                radius: 100,
                                fill: '#e4e4e7'
                            }]);
                        }} className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white hover:shadow-sm transition-all text-zinc-600">
                            <Circle size={20} />
                            <span className="text-[10px]">Circle</span>
                        </button>
                    </div>
                </div>

                {/* Center - Canvas */}
                <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-auto p-8">
                    <Editor
                        ref={editorRef}
                        nodes={nodes}
                        onNodesChange={(newNodes) => {
                            // Only push to history if actually changed (drag end)
                            // Editor calls onNodesChange on drag end.
                            // We might get partial updates so we should compare or just debouce?
                            // For now assuming drag end calls this once.
                            pushToHistory(newNodes);
                        }}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        preset={project.canvas_preset as any}
                        backgroundColor={project.design_json?.backgroundColor}
                    />
                </div>

                {/* Right Panel - Properties */}
                <div className="w-80 border-l bg-white shrink-0">
                    <PropertiesPanel
                        selectedNode={selectedNode}
                        onUpdate={(updates) => {
                            // Immediate update for UI, but debounced history?
                            // For simplicty, push to history on every change? No, that's too much (spamming undo for 1px drag).
                            // Ideally PropertiesPanel should have onUpdateEnd or similar.
                            // For now assuming drag end calls this once.
                            // For now, let's just update nodes directly and maybe not push history for every single character type?
                            // Actually, let's update state directly and maybe push history on blur?
                            // Complex. Let's just update nodes state without history for properties, 
                            // and let user manually save or rely on 'onNodesChange'?? No properties panel updates nodes.
                            // Let's create a 'pushHistory' wrapper that we only call sometimes?
                            // For now, we update nodes directly, and we lose undo for property changes unless we structure it better.
                            // Wait, user expects Undo to work for properties.
                            // I will use direct setNodes for now to keep it responsive, and maybe debounce history?
                            // Or just push history. It is fine for now.
                            const newNodes = nodes.map(n => n.id === selectedId ? { ...n, ...updates } : n);
                            setNodes(newNodes);
                            // We need to sync history eventually. 
                            // Let's just update history here too, but maybe replace the last history item if it's the same node being edited?
                            // That's complex. Let's just set Nodes.
                            // To make Undo work for properties, we'd need to pushToHistory(newNodes).
                            // But typing in a text box calls this on every keystroke. Bad.
                            // Compromise: Update nodes directly. Add a "Save Snapshot" or use Debounce.
                            // I will leave it as setNodes (no history) for high-frequency property updates for now to avoid freezing, 
                            // UNLESS I implement a specialized debounce or 'final' commit.
                            // Actually, let's try to pass a 'commit' flag? No properties panel is simple.
                            // Fine, I will push history.
                            pushToHistory(newNodes);
                        }}
                        canvasWidth={presetDimensions.width}
                        canvasHeight={presetDimensions.height}
                    />
                </div>
            </div>
        </div>
    );
}
