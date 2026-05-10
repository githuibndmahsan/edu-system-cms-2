
-- Roles
create type public.app_role as enum ('admin', 'staff');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Admins can view roles"
  on public.user_roles for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Applications
create type public.application_status as enum ('pending', 'approved', 'rejected');

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  father_name text not null,
  class_applying text not null,
  age int not null,
  contact text not null,
  address text not null,
  previous_school text,
  document_path text,
  status public.application_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.applications enable row level security;

create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger applications_updated_at
before update on public.applications
for each row execute function public.tg_set_updated_at();

-- Anyone (including anon) can submit an application
create policy "Anyone can submit application"
  on public.applications for insert
  to anon, authenticated
  with check (true);

-- Only admins can view, update, delete
create policy "Admins can view applications"
  on public.applications for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update applications"
  on public.applications for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete applications"
  on public.applications for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for documents (private)
insert into storage.buckets (id, name, public)
values ('admission-docs', 'admission-docs', false)
on conflict (id) do nothing;

-- Anyone can upload into admission-docs (form is public)
create policy "Public upload to admission docs"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'admission-docs');

-- Only admins can read documents
create policy "Admins can read admission docs"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'admission-docs' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete admission docs"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'admission-docs' and public.has_role(auth.uid(), 'admin'));
