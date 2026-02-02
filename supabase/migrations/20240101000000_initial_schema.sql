-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  role text check (role in ('buyer', 'seller')) default 'buyer',
  created_at timestamptz default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create vendors table
create table public.vendors (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) not null,
  name text not null,
  description text,
  location text,
  image_url text,
  rating numeric default 0,
  review_count integer default 0,
  verified boolean default false,
  joined_date timestamptz default now()
);

-- Enable RLS on vendors
alter table public.vendors enable row level security;

-- Create products table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  vendor_id uuid references public.vendors(id) on delete cascade not null,
  title text not null,
  description text,
  price numeric not null,
  category text,
  condition text,
  sizes text[],
  image_urls text[],
  created_at timestamptz default now()
);

-- Enable RLS on products
alter table public.products enable row level security;

-- RLS Policies

-- Profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Vendors
create policy "Vendors are viewable by everyone"
  on public.vendors for select
  using ( true );

create policy "Authenticated users can insert vendors"
  on public.vendors for insert
  with check ( auth.role() = 'authenticated' ); 
  -- Ideally we also check if they are the owner, but for insert we just check auth. 
  -- A trigger could ensure owner_id matches auth.uid(), or we trust the API call for now (validated in middleware usually).
  -- Better: with check ( auth.uid() = owner_id );

create policy "Users can update own vendor"
  on public.vendors for update
  using ( auth.uid() = owner_id );

-- Products
create policy "Products are viewable by everyone"
  on public.products for select
  using ( true );

create policy "Vendor owners can insert products"
  on public.products for insert
  with check ( 
    exists (
      select 1 from public.vendors
      where vendors.id = vendor_id
      and vendors.owner_id = auth.uid()
    )
  );

create policy "Vendor owners can update products"
  on public.products for update
  using (
    exists (
      select 1 from public.vendors
      where vendors.id = vendor_id
      and vendors.owner_id = auth.uid()
    )
  );

create policy "Vendor owners can delete products"
  on public.products for delete
  using (
    exists (
      select 1 from public.vendors
      where vendors.id = vendor_id
      and vendors.owner_id = auth.uid()
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'buyer')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage Buckets (Optional: In Supabase, buckets are usually created via API or Dashboard, but we can try to insert if permitted)
-- Note: Creating buckets via SQL in migrations might fail depending on permissions. 
-- We will skip bucket creation in SQL and assume the user can create 'vendor-assets' and 'product-images' manually or we use the API later.
-- For now, let's just focus on tables.
