"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseCsv } from "@/lib/csv";
import { productSchema } from "@/lib/validation";
import type { ImportState } from "@/lib/actions/customers";
import { createSupabaseServerClient } from "@/lib/supabase";

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return fallback;
}

function buildProductPayload(formData: FormData) {
  return {
    proveedor: String(formData.get("proveedor") || "ENPA"),
    referencia: String(formData.get("referencia") || ""),
    descripcion: String(formData.get("descripcion") || ""),
    familia: String(formData.get("familia") || ""),
    precio: Number(formData.get("precio") || 0),
    estado: String(formData.get("estado") || "Activo"),
    origen_familia: String(formData.get("origen_familia") || ""),
    observaciones: String(formData.get("observaciones") || "")
  };
}

function getProductRedirectPath(id?: string | null) {
  return id ? `/products/${id}/edit` : "/products/new";
}

export async function saveProductAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const id = String(formData.get("id") || "");
  const parsed = productSchema.safeParse(buildProductPayload(formData));

  if (!parsed.success) {
    redirect(`${getProductRedirectPath(id)}?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  try {
    if (id) {
      const { error } = await supabase.from("productos").update(parsed.data).eq("id", id);
      if (error) {
        throw error;
      }
    } else {
      const { error } = await supabase.from("productos").insert(parsed.data);
      if (error) {
        throw error;
      }
    }
  } catch (error) {
    const rawMessage = getErrorMessage(error, "");
    const message = rawMessage.toLowerCase().includes("duplicate")
      ? "Ya existe un producto con esa referencia."
      : "No se pudo guardar el producto.";
    redirect(`${getProductRedirectPath(id)}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/");
  revalidatePath("/products");
  redirect(`/products?success=${encodeURIComponent(id ? "Producto actualizado." : "Producto creado.")}`);
}

export async function deleteProductAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const id = String(formData.get("id") || "");
  if (!id) {
    redirect(`/products?error=${encodeURIComponent("Producto no valido.")}`);
  }

  try {
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) {
      throw error;
    }
  } catch (error) {
    redirect(
      `/products?error=${encodeURIComponent(
        getErrorMessage(error, "No se puede eliminar un producto incluido en pedidos.")
      )}`
    );
  }

  revalidatePath("/");
  revalidatePath("/products");
  redirect(`/products?success=${encodeURIComponent("Producto eliminado.")}`);
}

export async function importProductsAction(_: ImportState, formData: FormData): Promise<ImportState> {
  const supabase = createSupabaseServerClient();
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
  const validRows: Array<Record<string, string | number>> = [];

  for (const [index, record] of records.entries()) {
    const parsed = productSchema.safeParse({
      proveedor: record.proveedor || "ENPA",
      referencia: record.referencia || record.sku || "",
      descripcion: record.descripcion || record.description || "",
      familia: record.familia || "",
      precio: record.precio || record.price || 0,
      estado: record.estado || "Activo",
      origen_familia: record.origen_familia || record.origen || record.proveedor || "ENPA",
      observaciones: record.observaciones || record.notes || ""
    });

    if (!parsed.success) {
      errors.push(`Fila ${index + 2}: ${parsed.error.issues[0].message}`);
      continue;
    }

    validRows.push(parsed.data);
  }

  let imported = 0;

  if (validRows.length > 0) {
    const { error, data } = await supabase
      .from("productos")
      .upsert(validRows, { onConflict: "referencia" })
      .select("id");

    if (error) {
      errors.push(`Error general de importacion: ${error.message}`);
    } else {
      imported = data?.length || validRows.length;
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
