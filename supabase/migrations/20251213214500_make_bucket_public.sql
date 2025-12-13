-- Make the slate-media bucket public
update storage.buckets
set public = true
where id = 'slate-media';

-- Ensure it exists and is public (upsert)
insert into storage.buckets (id, name, public)
values ('slate-media', 'slate-media', true)
on conflict (id) do update
set public = true;

-- Remove the "avif/webp" restriction if it exists to allow generic images
-- (Optional, usually default allows all)
