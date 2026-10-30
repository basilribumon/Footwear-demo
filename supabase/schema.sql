-- Run this file in Supabase SQL Editor for the project's first setup.
create extension if not exists pgcrypto;

create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null check (category in ('Men','Women','Boys')),
  price integer not null check (price > 0),
  badge text not null default '',
  color text not null default '',
  image text not null,
  swatches jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_store_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$ select exists (select 1 from public.admin_users where user_id = auth.uid()); $$;
revoke all on function public.is_store_admin() from public;
grant execute on function public.is_store_admin() to authenticated;

alter table public.products enable row level security;
alter table public.admin_users enable row level security;
drop policy if exists "Anyone can view products" on public.products;
create policy "Anyone can view products" on public.products for select to anon, authenticated using (true);
drop policy if exists "Store admins can manage products" on public.products;
create policy "Store admins can manage products" on public.products for all to authenticated using (public.is_store_admin()) with check (public.is_store_admin());
drop policy if exists "Admins can view their own admin record" on public.admin_users;
create policy "Admins can view their own admin record" on public.admin_users for select to authenticated using (user_id = auth.uid());

create table if not exists public.order_inquiries (
  id text primary key,
  created_at timestamptz not null default now(),
  total integer not null check (total > 0),
  items jsonb not null check (jsonb_typeof(items) = 'array')
);
alter table public.order_inquiries enable row level security;
grant usage on schema public to anon, authenticated;
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant select on public.admin_users to authenticated;
grant insert on public.order_inquiries to anon, authenticated;
grant select on public.order_inquiries to authenticated;
drop policy if exists "Visitors can create checkout inquiries" on public.order_inquiries;
create policy "Visitors can create checkout inquiries" on public.order_inquiries for insert to anon, authenticated with check (total > 0 and jsonb_typeof(items) = 'array');
drop policy if exists "Store admins can view checkout inquiries" on public.order_inquiries;
create policy "Store admins can view checkout inquiries" on public.order_inquiries for select to authenticated using (public.is_store_admin());

insert into public.products (id,name,category,price,badge,color,image,swatches) values
('s7782','Arabic Sandal — S7782','Men',3499,'BESTSELLER','Sand / Tan','https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=82','["#d5c3a1","#292c29","#9b7550"]'),
('at08','Arabic Sandal — AT08','Men',3299,'NEW','Stone / Black','https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=82','["#c9c4b4","#242522","#a77d54"]'),
('astra','Astra Heeled Sandal','Women',3899,'','Warm Tan','https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=82','["#a96d45","#4c3631","#d8c8b0"]'),
('najma','Najma Ostrich Sandal','Women',4299,'LIMITED','Soft Beige','https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=900&q=82','["#d3c0a2","#a98060"]'),
('at01v2','Arabic Sandal — AT01 V2','Men',3499,'','Olive / Cream','https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=82','["#72755b","#e1d9c9","#242522"]'),
('at01b','Boy’s Arabic Sandal — AT01B','Boys',2299,'','Classic Black','https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=82','["#292b29","#d0c2a5"]'),
('athman60','Athman Star — 60','Men',4799,'ATHMAN STAR','Cream Leather','https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=82','["#e2d9c9","#c7b59b"]'),
('at19','Arabic Sandal — AT19','Men',3299,'','Dark Brown','https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=82','["#40332c","#ddd2bd","#222321"]')
on conflict (id) do nothing;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = 5242880;

drop policy if exists "Public can view product photos" on storage.objects;
create policy "Public can view product photos" on storage.objects for select to anon, authenticated using (bucket_id = 'product-images');
drop policy if exists "Store admins can upload product photos" on storage.objects;
create policy "Store admins can upload product photos" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.is_store_admin());
drop policy if exists "Store admins can update product photos" on storage.objects;
create policy "Store admins can update product photos" on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.is_store_admin()) with check (bucket_id = 'product-images' and public.is_store_admin());
drop policy if exists "Store admins can delete product photos" on storage.objects;
create policy "Store admins can delete product photos" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.is_store_admin());

-- Create an Auth user in Supabase, then run this with that user's UUID:
-- insert into public.admin_users (user_id) values ('YOUR_AUTH_USER_UUID');
