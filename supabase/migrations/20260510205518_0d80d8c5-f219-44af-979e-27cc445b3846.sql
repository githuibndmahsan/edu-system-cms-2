
-- Teachers table
create table public.teachers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  designation text not null,
  department text,
  teaching_level text,
  subjects text[] not null default '{}',
  qualifications jsonb not null default '[]'::jsonb,
  experiences jsonb not null default '[]'::jsonb,
  certifications jsonb not null default '[]'::jsonb,
  skills text[] not null default '{}',
  languages text[] not null default '{}',
  achievements text[] not null default '{}',
  bio text,
  email text,
  phone text,
  linkedin_url text,
  facebook_url text,
  photo_path text,
  resume_path text,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.teachers enable row level security;

create policy "Public can view published teachers"
on public.teachers for select
to anon, authenticated
using (is_published = true);

create policy "Admins can view all teachers"
on public.teachers for select
to authenticated
using (has_role(auth.uid(), 'admin'::app_role));

create policy "Admins can insert teachers"
on public.teachers for insert
to authenticated
with check (has_role(auth.uid(), 'admin'::app_role));

create policy "Admins can update teachers"
on public.teachers for update
to authenticated
using (has_role(auth.uid(), 'admin'::app_role));

create policy "Admins can delete teachers"
on public.teachers for delete
to authenticated
using (has_role(auth.uid(), 'admin'::app_role));

create trigger teachers_set_updated_at
before update on public.teachers
for each row execute function public.tg_set_updated_at();

create index teachers_published_sort_idx on public.teachers (is_published, sort_order, created_at desc);

-- Storage buckets
insert into storage.buckets (id, name, public) values ('teacher-photos', 'teacher-photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) values ('teacher-resumes', 'teacher-resumes', false)
on conflict (id) do nothing;

-- teacher-photos policies (public read, admin write)
create policy "Public can read teacher photos"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'teacher-photos');

create policy "Admins can upload teacher photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'teacher-photos' and has_role(auth.uid(), 'admin'::app_role));

create policy "Admins can update teacher photos"
on storage.objects for update
to authenticated
using (bucket_id = 'teacher-photos' and has_role(auth.uid(), 'admin'::app_role));

create policy "Admins can delete teacher photos"
on storage.objects for delete
to authenticated
using (bucket_id = 'teacher-photos' and has_role(auth.uid(), 'admin'::app_role));

-- teacher-resumes policies (admin only)
create policy "Admins can read teacher resumes"
on storage.objects for select
to authenticated
using (bucket_id = 'teacher-resumes' and has_role(auth.uid(), 'admin'::app_role));

create policy "Admins can upload teacher resumes"
on storage.objects for insert
to authenticated
with check (bucket_id = 'teacher-resumes' and has_role(auth.uid(), 'admin'::app_role));

create policy "Admins can update teacher resumes"
on storage.objects for update
to authenticated
using (bucket_id = 'teacher-resumes' and has_role(auth.uid(), 'admin'::app_role));

create policy "Admins can delete teacher resumes"
on storage.objects for delete
to authenticated
using (bucket_id = 'teacher-resumes' and has_role(auth.uid(), 'admin'::app_role));
