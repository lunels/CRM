"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseCsv } from "@/lib/csv";
import { productSchema } from "@/lib/validation";
import type { ImportState } from "@/lib/actions/customers";

function buildProductPayload(formData: FormData) {
  return {
    name: String(formData.get("name") || ""),
    sku: String(formData.get("sku") || ""),
    description: String(formData.get("description") || ""),
    price: Number(formData.get("price") || 0),
    stock: Number(formData.get("stock") || 0),
    category: String(formData.get("category") || ""),
    isActive: formData.get("isActive") === "on"
  };
}

function getProductRedirectPath(id?: string | null) {
  return id ? `/products/${id}/edit` : "/products/new";
}

export async function saveProductAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const parsed = productSchema.safeParse(buildProductPayload(formData));

  if (!parsed.success) {
    redirect(`${getProductRedirectPath(id)}?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  try {
    if (id) {
      await prisma.product.update({
        where: { id },
        data: parsed.data
      });
    } else {
      await prisma.product.create({
        data: parsed.data
      });
    }
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("Unique constraint")
        ? "Ya existe un producto con ese SKU."
        : "No se pudo guardar el producto.";
    redirect(`${getProductRedirectPath(id)}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/");
  revalidatePath("/products");
  redirect(`/products?success=${encodeURIComponent(id ? "Producto actualizado." : "Producto creado.")}`);
}

export async function deleteProductAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) {
    redirect(`/products?error=${encodeURIComponent("Producto no valido.")}`);
  }

  try {
    await prisma.product.delete({
      where: { id }
    });
  } catch {
    redirect(
      `/products?error=${encodeURIComponent("No se puede eliminar un producto incluido en pedidos.")}`
    );
  }

  revalidatePath("/");
  revalidatePath("/products");
  redirect(`/products?success=${encodeURIComponent("Producto eliminado.")}`);
}

export async function importProductsAction(_: ImportState, formData: FormData): Promise<ImportState> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return {
      success: false,
      summary: "Selecciona un archivo CSV antes de importar.",
      errors: []
    };
  }

  const content = await file.text();
  const records = parseCsv(content);

  if (records.length === 0) {
    return {
      success: false,
      summary: "El archivo esta vacio o no contiene filas validas.",
      errors: []
    };
  }

  const errors: string[] = [];
  let imported = 0;

  for (const [index, record] of records.entries()) {
    const parsed = productSchema.safeParse({
      name: record.nombre || record.name || "",
      sku: record.sku || record.referencia || "",
      description: record.descripcion || record.description || "",
      price: record.precio || record.price || 0,
      stock: record.stock || 0,
      category: record.categoria || record.category || "",
      isActive: ["true", "1", "si", "yes", "activo"].includes(
        String(record.activo || record.is_active || "true").toLowerCase()
      )
    });

    if (!parsed.success) {
      errors.push(`Fila ${index + 2}: ${parsed.error.issues[0].message}`);
      continue;
    }

    try {
      await prisma.product.upsert({
        where: { sku: parsed.data.sku },
        update: parsed.data,
        create: parsed.data
      });
      imported += 1;
    } catch {
      errors.push(`Fila ${index + 2}: no se pudo insertar el producto.`);
    }
  }

  revalidatePath("/");
  revalidatePath("/products");

  return {
    success: imported > 0,
    summary: `Importacion finalizada. ${imported} productos procesados correctamente y ${errors.length} filas con error.`,
    errors
  };
}
