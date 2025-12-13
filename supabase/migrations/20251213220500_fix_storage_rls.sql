-- Ensure bucket exists and is public
insert into storage.buckets (id, name, public)
values ('slate-media', 'slate-media', true)
on conflict (id) do update set public = true;

-- Drop existing policies to avoid conflicts (permissive cleanup)
drop policy if exists "Authenticated users can upload to slate-media" on storage.objects;
drop policy if exists "Authenticated users can update slate-media" on storage.objects;
drop policy if exists "Authenticated users can delete from slate-media" on storage.objects;
drop policy if exists "Anyone can read slate-media" on storage.objects;

-- Create policies
create policy "Authenticated users can upload to slate-media"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'slate-media' );

create policy "Authenticated users can update slate-media"
on storage.objects for update
to authenticated
using ( bucket_id = 'slate-media' );

create policy "Authenticated users can delete from slate-media"
on storage.objects for delete
to authenticated
using ( bucket_id = 'slate-media' );

-- Public read access
create policy "Anyone can read slate-media"
on storage.objects for select
to public
using ( bucket_id = 'slate-media' );
