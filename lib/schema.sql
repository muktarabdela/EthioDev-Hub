-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  role text check (role in ('developer', 'user', 'hr')),
  bio text,
  github_url text,
  linkedin_url text,
  contact_visible boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Projects table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  developer_id uuid references public.profiles(id) on delete cascade not null,
  github_url text,
  live_url text,
  upvotes_count integer default 0,
  comments_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.projects enable row level security;

-- Comments table
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.comments enable row level security;

-- Upvotes table (for many-to-many relationship between users and projects)
create table public.upvotes (
  user_id uuid references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, project_id)
);

-- Enable RLS
alter table public.upvotes enable row level security;

-- RLS Policies

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Projects policies
create policy "Projects are viewable by everyone"
  on public.projects for select
  using (true);

create policy "Authenticated users can create projects"
  on public.projects for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = developer_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = developer_id);

-- Comments policies
create policy "Comments are viewable by everyone"
  on public.comments for select
  using (true);

create policy "Authenticated users can create comments"
  on public.comments for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update own comments"
  on public.comments for update
  using (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

-- Upvotes policies
create policy "Upvotes are viewable by everyone"
  on public.upvotes for select
  using (true);

create policy "Authenticated users can upvote"
  on public.upvotes for insert
  with check (auth.role() = 'authenticated');

create policy "Users can remove own upvotes"
  on public.upvotes for delete
  using (auth.uid() = user_id);

-- Functions

-- Function to handle upvoting
create or replace function handle_upvote(project_id uuid)
returns void as $$
begin
  insert into public.upvotes (user_id, project_id)
  values (auth.uid(), project_id)
  on conflict (user_id, project_id) do nothing;
  
  update public.projects
  set upvotes_count = (
    select count(*)
    from public.upvotes
    where upvotes.project_id = projects.id
  )
  where id = project_id;
end;
$$ language plpgsql security definer;

-- Function to handle removing upvote
create or replace function handle_remove_upvote(project_id uuid)
returns void as $$
begin
  delete from public.upvotes
  where user_id = auth.uid() and project_id = $1;
  
  update public.projects
  set upvotes_count = (
    select count(*)
    from public.upvotes
    where upvotes.project_id = projects.id
  )
  where id = project_id;
end;
$$ language plpgsql security definer;

-- Triggers

-- Update comments count trigger
create or replace function update_comments_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.projects
    set comments_count = comments_count + 1
    where id = NEW.project_id;
  elsif (TG_OP = 'DELETE') then
    update public.projects
    set comments_count = comments_count - 1
    where id = OLD.project_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger update_comments_count_trigger
after insert or delete on public.comments
for each row execute function update_comments_count(); 