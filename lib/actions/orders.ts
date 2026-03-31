"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validation";
import { TAX_RATE } from "@/lib/constants";

function parseItems(itemsJson: string) {
  try {
    const raw = JSON.parse(itemsJson) as Array<{ productId: string; quantity: number; unitPrice: number }>;
    return raw.map((item) => ({
      productId: String(item.productId || ""),
      quantity: Number(item.quantity || 0),
      unitPrice: Number(item.unitPrice || 0)
    }));
  } catch {
    return [];
  }
}

function getOrderRedirectPath(id?: string | null) {
  return id ? `/orders/${id}/edit` : "/orders/new";
}

export async function saveOrderAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const items = parseItems(String(formData.get("itemsJson") || "[]"));
  const parsed = orderSchema.safeParse({
    orderNumber: String(formData.get("orderNumber") || ""),
    customerId: String(formData.get("customerId") || ""),
    date: String(formData.get("date") || ""),
    status: String(formData.get("status") || "PENDING"),
    notes: String(formData.get("notes") || ""),
    items
  });

  if (!parsed.success) {
    redirect(`${getOrderRedirectPath(id)}?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const subtotal = parsed.data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const orderData = {
    orderNumber: parsed.data.orderNumber,
    customerId: parsed.data.customerId,
    date: new Date(parsed.data.date),
    status: parsed.data.status,
    notes: parsed.data.notes,
    subtotal: new Prisma.Decimal(subtotal.toFixed(2)),
    tax: new Prisma.Decimal(tax.toFixed(2)),
    total: new Prisma.Decimal(total.toFixed(2))
  };

  try {
    if (id) {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id },
          data: orderData
        });
        await tx.orderItem.deleteMany({
          where: { orderId: id }
        });
        await tx.orderItem.createMany({
          data: parsed.data.items.map((item) => ({
            orderId: id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: new Prisma.Decimal(item.unitPrice.toFixed(2)),
            lineTotal: new Prisma.Decimal((item.quantity * item.unitPrice).toFixed(2))
          }))
        });
      });
    } else {
      await prisma.order.create({
        data: {
          ...orderData,
          items: {
            create: parsed.data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: new Prisma.Decimal(item.unitPrice.toFixed(2)),
              lineTotal: new Prisma.Decimal((item.quantity * item.unitPrice).toFixed(2))
            }))
          }
        }
      });
    }
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("Unique constraint")
        ? "Ya existe un pedido con ese numero."
        : "No se pudo guardar el pedido.";
    redirect(`${getOrderRedirectPath(id)}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/");
  revalidatePath("/orders");
  redirect(`/orders?success=${encodeURIComponent(id ? "Pedido actualizado." : "Pedido creado.")}`);
}

export async function updateOrderStatusAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "PENDING");

  await prisma.order.update({
    where: { id },
    data: {
      status: status as never
    }
  });

  revalidatePath("/");
  revalidatePath("/orders");
  revalidatePath(`/orders/${id}`);
  redirect(`/orders/${id}?success=${encodeURIComponent("Estado actualizado.")}`);
}
