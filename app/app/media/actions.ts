'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteMediaAsset(assetId: string, storagePath: string) {
    const supabase = await createClient();

    try {
        // 1. Delete from Storage
        const { error: storageError } = await supabase.storage
            .from('slate-media')
            .remove([storagePath]);

        if (storageError) {
            console.error('Storage Delete Error:', storageError);
            throw new Error('Failed to delete file from storage');
        }

        // 2. Delete from DB
        const { error: dbError } = await supabase
            .from('media_assets')
            .delete()
            .eq('id', assetId);

        if (dbError) {
            console.error('DB Delete Error:', dbError);
            throw new Error('Failed to delete record from database');
        }

        revalidatePath('/app/media');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
