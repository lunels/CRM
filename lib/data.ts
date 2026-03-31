import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Customer, Order, OrderLine, Product } from "@/lib/types";

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return value;
  }
  return Number(value || 0);
}

function normalizeCustomer(row: any): Customer {
  return {
    id: row.id,
    nombre: row.nombre,
    email: row.email,
    telefono: row.telefono,
    direccion: row.direccion,
    ciudad: row.ciudad,
    codigo_postal: row.codigo_postal,
    pais: row.pais,
    notas: row.notas,
    created_at: row.created_at
  };
}

function normalizeProduct(row: any): Product {
  return {
    id: row.id,
    nombre: row.nombre,
    sku: row.sku,
    descripcion: row.descripcion,
    precio: toNumber(row.precio),
    stock: row.stock,
    categoria: row.categoria,
    activo: row.activo,
    created_at: row.created_at
  };
}

function normalizeOrderLine(row: any): OrderLine {
  return {
    id: row.id,
    pedido_id: row.pedido_id,
    producto_id: row.producto_id,
    cantidad: row.cantidad,
    precio_unitario: toNumber(row.precio_unitario),
    total: toNumber(row.total),
    producto: row.producto
      ? {
          id: row.producto.id,
          nombre: row.producto.nombre,
          sku: row.producto.sku
        }
      : null
  };
}

function normalizeOrder(row: any): Order {
  return {
    id: row.id,
    numero: row.numero,
    cliente_id: row.cliente_id,
    fecha: row.fecha,
    estado: row.estado,
    subtotal: toNumber(row.subtotal),
    impuestos: toNumber(row.impuestos),
    total: toNumber(row.total),
    notas: row.notas,
    created_at: row.created_at,
    cliente: row.cliente
      ? {
          id: row.cliente.id,
          nombre: row.cliente.nombre,
          email: row.cliente.email,
          telefono: row.cliente.telefono
        }
      : null,
    lineas: Array.isArray(row.lineas) ? row.lineas.map(normalizeOrderLine) : []
  };
}

export async function fetchCustomers() {
  noStore();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("clientes").select("*").order("created_at", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return (data || []).map(normalizeCustomer);
}

export async function fetchCustomerById(id: string) {
  noStore();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("clientes").select("*").eq("id", id).maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data ? normalizeCustomer(data) : null;
}

export async function fetchProducts() {
  noStore();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("productos").select("*").order("created_at", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return (data || []).map(normalizeProduct);
}

export async function fetchActiveProducts() {
  noStore();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("activo", true)
    .order("nombre", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  return (data || []).map(normalizeProduct);
}

export async function fetchProductById(id: string) {
  noStore();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("productos").select("*").eq("id", id).maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data ? normalizeProduct(data) : null;
}

export async function fetchOrders() {
  noStore();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("pedidos")
    .select(
      "id, numero, cliente_id, fecha, estado, subtotal, impuestos, total, notas, created_at, cliente:clientes(id, nombre, email, telefono), lineas:pedido_lineas(id, pedido_id, producto_id, cantidad, precio_unitario, total)"
    )
    .order("fecha", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return (data || []).map(normalizeOrder);
}

export async function fetchRecentOrders() {
  noStore();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("pedidos")
    .select("id, numero, cliente_id, fecha, estado, subtotal, impuestos, total, notas, created_at, cliente:clientes(id, nombre, email, telefono)")
    .order("fecha", { ascending: false })
    .limit(5);
  if (error) {
    throw new Error(error.message);
  }
  return (data || []).map(normalizeOrder);
}

export async function fetchOrderById(id: string) {
  noStore();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("pedidos")
    .select(
      "id, numero, cliente_id, fecha, estado, subtotal, impuestos, total, notas, created_at, cliente:clientes(id, nombre, email, telefono), lineas:pedido_lineas(id, pedido_id, producto_id, cantidad, precio_unitario, total, producto:productos(id, nombre, sku))"
    )
    .eq("id", id)
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data ? normalizeOrder(data) : null;
}

export async function fetchDashboardStats() {
  noStore();
  const supabase = createSupabaseServerClient();

  const [{ count: customerCount, error: customerError }, { count: productCount, error: productError }, { count: orderCount, error: orderError }] =
    await Promise.all([
      supabase.from("clientes").select("*", { count: "exact", head: true }),
      supabase.from("productos").select("*", { count: "exact", head: true }),
      supabase.from("pedidos").select("*", { count: "exact", head: true })
    ]);

  if (customerError || productError || orderError) {
    throw new Error(customerError?.message || productError?.message || orderError?.message || "No se pudo leer el dashboard.");
  }

  return {
    customerCount: customerCount || 0,
    productCount: productCount || 0,
    orderCount: orderCount || 0
  };
}
