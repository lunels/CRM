create extension if not exists "pgcrypto";

create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  cliente_proveedor_id text,
  email text not null unique,
  telefono text not null,
  direccion text,
  ciudad text,
  codigo_postal text,
  pais text,
  notas text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.clientes add column if not exists cliente_proveedor_id text;

create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  proveedor text not null default 'ENPA',
  nombre text not null,
  sku text not null unique,
  referencia_proveedor text,
  familia text,
  imagen_url text,
  descripcion text,
  precio numeric(10, 2) not null default 0,
  stock integer not null default 0,
  categoria text,
  activo boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.productos add column if not exists proveedor text;
alter table public.productos alter column proveedor set default 'ENPA';
update public.productos set proveedor = 'ENPA' where proveedor is null;
alter table public.productos alter column proveedor set not null;
alter table public.productos add column if not exists referencia_proveedor text;
alter table public.productos add column if not exists familia text;
alter table public.productos add column if not exists imagen_url text;

create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  numero text not null unique,
  cliente_id uuid not null references public.clientes(id) on delete restrict,
  fecha date not null,
  estado text not null check (estado in ('PENDING', 'CONFIRMED', 'SHIPPED', 'COMPLETED', 'CANCELLED')),
  subtotal numeric(10, 2) not null default 0,
  impuestos numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  notas text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.pedido_lineas (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos(id) on delete cascade,
  producto_id uuid not null references public.productos(id) on delete restrict,
  cantidad integer not null check (cantidad > 0),
  precio_unitario numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0
);

create table if not exists public.comisiones (
  id uuid primary key default gen_random_uuid(),
  fecha date not null default current_date,
  proveedor text not null default 'ENPA',
  cliente_id uuid references public.clientes(id) on delete set null,
  porcentaje numeric(5, 2) not null default 0 check (porcentaje >= 0 and porcentaje <= 50),
  importe numeric(10, 2) not null default 0,
  observaciones text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists clientes_nombre_idx on public.clientes (nombre);
create index if not exists clientes_email_idx on public.clientes (email);
create index if not exists productos_nombre_idx on public.productos (nombre);
create index if not exists productos_sku_idx on public.productos (sku);
create index if not exists pedidos_numero_idx on public.pedidos (numero);
create index if not exists pedidos_cliente_id_idx on public.pedidos (cliente_id);
create index if not exists pedido_lineas_pedido_id_idx on public.pedido_lineas (pedido_id);
create index if not exists comisiones_cliente_id_idx on public.comisiones (cliente_id);

alter table public.clientes enable row level security;
alter table public.productos enable row level security;
alter table public.pedidos enable row level security;
alter table public.pedido_lineas enable row level security;
alter table public.comisiones enable row level security;

drop policy if exists "clientes_mvp_full_access" on public.clientes;
create policy "clientes_mvp_full_access" on public.clientes for all using (true) with check (true);

drop policy if exists "productos_mvp_full_access" on public.productos;
create policy "productos_mvp_full_access" on public.productos for all using (true) with check (true);

drop policy if exists "pedidos_mvp_full_access" on public.pedidos;
create policy "pedidos_mvp_full_access" on public.pedidos for all using (true) with check (true);

drop policy if exists "pedido_lineas_mvp_full_access" on public.pedido_lineas;
create policy "pedido_lineas_mvp_full_access" on public.pedido_lineas for all using (true) with check (true);

drop policy if exists "comisiones_mvp_full_access" on public.comisiones;
create policy "comisiones_mvp_full_access" on public.comisiones for all using (true) with check (true);
