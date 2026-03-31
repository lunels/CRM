"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";
import { orderSchema } from "@/lib/validation";
import { TAX_RATE } from "@/lib/constants";

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return fallback;
}

function parseItems(itemsJson: string) {
  try {
    const raw = JSON.parse(itemsJson) as Array<{ producto_id: string; cantidad: number; precio_unitario: number }>;
    return raw.map((item) => ({
      producto_id: String(item.producto_id || ""),
      cantidad: Number(item.cantidad || 0),
      precio_unitario: Number(item.precio_unitario || 0)
    }));
  } catch {
    return [];
  }
}

function getOrderRedirectPath(id?: string | null) {
  return id ? `/orders/${id}/edit` : "/orders/new";
}

export async function saveOrderAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const id = String(formData.get("id") || "");
  const items = parseItems(String(formData.get("itemsJson") || "[]"));
  const parsed = orderSchema.safeParse({
    numero: String(formData.get("numero") || ""),
    cliente_id: String(formData.get("cliente_id") || ""),
    fecha: String(formData.get("fecha") || ""),
    estado: String(formData.get("estado") || "PENDING"),
    notas: String(formData.get("notas") || ""),
    items
  });

  if (!parsed.success) {
    redirect(`${getOrderRedirectPath(id)}?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const subtotal = parsed.data.items.reduce((sum, item) => sum + item.cantidad * item.precio_unitario, 0);
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const orderData = {
    numero: parsed.data.numero,
    cliente_id: parsed.data.cliente_id,
    fecha: parsed.data.fecha,
    estado: parsed.data.estado,
    notas: parsed.data.notas,
    subtotal,
    impuestos: tax,
    total
  };

  try {
    if (id) {
      const { error: updateError } = await supabase.from("pedidos").update(orderData).eq("id", id);
      if (updateError) {
        throw updateError;
      }

      const { error: deleteLinesError } = await supabase.from("pedido_lineas").delete().eq("pedido_id", id);
      if (deleteLinesError) {
        throw deleteLinesError;
      }

      const { error: insertLinesError } = await supabase.from("pedido_lineas").insert(
        parsed.data.items.map((item) => ({
          pedido_id: id,
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          total: Number((item.cantidad * item.precio_unitario).toFixed(2))
        }))
      );
      if (insertLinesError) {
        throw insertLinesError;
      }
    } else {
      const { data: insertedOrder, error: insertOrderError } = await supabase
        .from("pedidos")
        .insert(orderData)
        .select("id")
        .single();

      if (insertOrderError || !insertedOrder) {
        throw insertOrderError || new Error("No se pudo crear el pedido.");
      }

      const { error: insertLinesError } = await supabase.from("pedido_lineas").insert(
        parsed.data.items.map((item) => ({
          pedido_id: insertedOrder.id,
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          total: Number((item.cantidad * item.precio_unitario).toFixed(2))
        }))
      );

      if (insertLinesError) {
        await supabase.from("pedidos").delete().eq("id", insertedOrder.id);
        throw insertLinesError;
      }
    }
  } catch (error) {
    const rawMessage = getErrorMessage(error, "");
    const message = rawMessage.toLowerCase().includes("duplicate")
      ? "Ya existe un pedido con ese numero."
      : "No se pudo guardar el pedido.";
    redirect(`${getOrderRedirectPath(id)}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/");
  revalidatePath("/orders");
  redirect(`/orders?success=${encodeURIComponent(id ? "Pedido actualizado." : "Pedido creado.")}`);
}

export async function updateOrderStatusAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "PENDING");

  const { error } = await supabase.from("pedidos").update({ estado: status }).eq("id", id);
  if (error) {
    redirect(`/orders/${id}?error=${encodeURIComponent("No se pudo actualizar el estado.")}`);
  }

  revalidatePath("/");
  revalidatePath("/orders");
  revalidatePath(`/orders/${id}`);
  redirect(`/orders/${id}?success=${encodeURIComponent("Estado actualizado.")}`);
}
