import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Commission, Customer, Order, OrderLine, Product, Provider } from "@/lib/types";

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
    proveedor: row.proveedor || "ENPA",
    referencia: row.referencia || row.referencia_proveedor || row.sku,
    descripcion: row.descripcion,
    familia: row.familia || row.categoria,
    origen_familia: row.origen_familia || row.proveedor || "ENPA",
    precio: toNumber(row.precio),
    estado: row.estado || (row.activo === false ? "Inactivo" : "Activo"),
    observaciones: row.observaciones || null,
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
          referencia: row.producto.referencia || row.producto.referencia_proveedor || row.producto.sku,
          descripcion: row.producto.descripcion
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
    .eq("estado", "Activo")
    .order("referencia", { ascending: true });
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

export async function fetchProviders() {
  noStore();
  const products = await fetchProducts();
  const providersMap = new Map<string, Provider>();

  for (const product of products) {
    if (!providersMap.has(product.proveedor)) {
      providersMap.set(product.proveedor, {
        id: product.proveedor.toLowerCase(),
        nombre: product.proveedor,
        codigo: product.proveedor === "ENPA" ? "ENPA" : product.proveedor.toUpperCase(),
        principal: product.proveedor === "ENPA",
        total_productos: 0,
        created_at: new Date().toISOString()
      });
    }

    providersMap.get(product.proveedor)!.total_productos += 1;
  }

  if (providersMap.size === 0) {
    providersMap.set("ENPA", {
      id: "enpa",
      nombre: "ENPA",
      codigo: "ENPA",
      principal: true,
      total_productos: 0,
      created_at: new Date().toISOString()
    });
  }

  return Array.from(providersMap.values());
}

export async function fetchCommissionPreview() {
  noStore();
  const orders = await fetchOrders();

  return orders.slice(0, 20).map<Commission>((order) => ({
    id: `com-${order.id}`,
    fecha: order.fecha,
    proveedor: "ENPA",
    cliente: order.cliente?.nombre || "Cliente",
    porcentaje: 0,
    importe: 0,
    observaciones: "Pendiente de registrar porcentaje e importe real."
  }));
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
      "id, numero, cliente_id, fecha, estado, subtotal, impuestos, total, notas, created_at, cliente:clientes(id, nombre, email, telefono), lineas:pedido_lineas(id, pedido_id, producto_id, cantidad, precio_unitario, total, producto:productos(id, referencia, descripcion))"
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
