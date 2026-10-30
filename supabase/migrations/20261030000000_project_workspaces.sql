create table public.client_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  company text not null default '',
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.client_profiles (user_id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 150),
  service text not null check (char_length(trim(service)) between 1 and 150),
  summary text not null default '' check (char_length(summary) <= 3000),
  status text not null default 'planning' check (status in ('planning', 'in_progress', 'review', 'completed', 'on_hold')),
  progress integer not null default 0 check (progress between 0 and 100),
  start_date date,
  target_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (target_date is null or start_date is null or target_date >= start_date)
);

create table public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete restrict,
  title text not null check (char_length(trim(title)) between 1 and 150),
  body text not null check (char_length(trim(body)) between 1 and 3000),
  created_at timestamptz not null default now()
);

create table public.project_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete restrict,
  body text not null check (char_length(trim(body)) between 1 and 3000),
  created_at timestamptz not null default now()
);

create index projects_client_id_updated_at_idx on public.projects (client_id, updated_at desc);
create index project_updates_project_id_created_at_idx on public.project_updates (project_id, created_at desc);
create index project_messages_project_id_created_at_idx on public.project_messages (project_id, created_at asc);

create function public.handle_new_client_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.client_profiles (user_id, email, full_name, company)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'company', '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_client_profile() from public, anon, authenticated;

create trigger on_auth_user_created_project_profile
  after insert on auth.users
  for each row execute function public.handle_new_client_profile();

insert into public.client_profiles (user_id, email, full_name, company)
select
  id,
  coalesce(email, ''),
  coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name', ''),
  coalesce(raw_user_meta_data ->> 'company', '')
from auth.users
on conflict (user_id) do nothing;

create function public.set_project_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_project_updated_at() from public, anon, authenticated;

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_project_updated_at();

alter table public.client_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_updates enable row level security;
alter table public.project_messages enable row level security;

revoke all on table public.client_profiles, public.projects, public.project_updates, public.project_messages from anon, authenticated;
grant usage on schema public to authenticated;
grant select on table public.client_profiles to authenticated;
grant select, insert, update, delete on table public.projects to authenticated;
grant select, insert on table public.project_updates to authenticated;
grant select, insert on table public.project_messages to authenticated;

create policy "Clients and staff can view permitted profiles"
  on public.client_profiles for select to authenticated
  using (
    user_id = (select auth.uid())
    or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "Clients and staff can view permitted projects"
  on public.projects for select to authenticated
  using (
    client_id = (select auth.uid())
    or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "Staff can create projects"
  on public.projects for insert to authenticated
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Staff can update projects"
  on public.projects for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Staff can delete projects"
  on public.projects for delete to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Clients and staff can view permitted project updates"
  on public.project_updates for select to authenticated
  using (
    (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    or exists (
      select 1 from public.projects
      where projects.id = project_updates.project_id
        and projects.client_id = (select auth.uid())
    )
  );

create policy "Staff can publish project updates"
  on public.project_updates for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "Clients and staff can read permitted project messages"
  on public.project_messages for select to authenticated
  using (
    (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    or exists (
      select 1 from public.projects
      where projects.id = project_messages.project_id
        and projects.client_id = (select auth.uid())
    )
  );

create policy "Clients and staff can send messages to permitted projects"
  on public.project_messages for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and exists (
      select 1 from public.projects
      where projects.id = project_messages.project_id
        and (
          projects.client_id = (select auth.uid())
          or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        )
    )
  );

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'project_messages'
    ) then
    alter publication supabase_realtime add table public.project_messages;
  end if;
end;
$$;