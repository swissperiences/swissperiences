-- Create corporate_inquiries table
create table if not exists public.corporate_inquiries (
    id uuid default gen_random_uuid() primary key,
    company_name text not null,
    contact_name text not null,
    email text not null,
    team_size text,
    message text,
    newsletter_opt_in boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    status text default 'new',
    source text default 'inquiry_modal'
);

-- Enable RLS
alter table public.corporate_inquiries enable row level security;

-- Create policy to allow public inserts (since it's a public form)
create policy "Allow public inserts"
on public.corporate_inquiries
for insert
to public
with check (true);

-- Create policy to allow read access only to authenticated users (admin)
create policy "Allow authenticated read access"
on public.corporate_inquiries
for select
to authenticated
using (true);
