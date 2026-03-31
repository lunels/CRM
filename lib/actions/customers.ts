"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseCsv } from "@/lib/csv";
import { createSupabaseServerClient } from "@/lib/supabase";
import { customerSchema } from "@/lib/validation";

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return fallback;
}

function buildCustomerPayload(formData: FormData) {
  return {
    nombre: String(formData.get("nombre") || ""),
    email: String(formData.get("email") || ""),
    telefono: String(formData.get("telefono") || ""),
    direccion: String(formData.get("direccion") || ""),
    ciudad: String(formData.get("ciudad") || ""),
    codigo_postal: String(formData.get("codigo_postal") || ""),
    pais: String(formData.get("pais") || ""),
    notas: String(formData.get("notas") || "")
  };
}

function getCustomerRedirectPath(id?: string | null) {
  return id ? `/customers/${id}/edit` : "/customers/new";
}

export async function saveCustomerAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const id = String(formData.get("id") || "");
  const parsed = customerSchema.safeParse(buildCustomerPayload(formData));

  if (!parsed.success) {
    redirect(`${getCustomerRedirectPath(id)}?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  try {
    if (id) {
      const { error } = await supabase.from("clientes").update(parsed.data).eq("id", id);
      if (error) {
        throw error;
      }
    } else {
      const { error } = await supabase.from("clientes").insert(parsed.data);
      if (error) {
        throw error;
      }
    }
  } catch (error) {
    const rawMessage = getErrorMessage(error, "");
    const message = rawMessage.toLowerCase().includes("duplicate")
      ? "Ya existe un cliente con ese email."
      : "No se pudo guardar el cliente.";
    redirect(`${getCustomerRedirectPath(id)}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/");
  revalidatePath("/customers");
  redirect(`/customers?success=${encodeURIComponent(id ? "Cliente actualizado." : "Cliente creado.")}`);
}

export async function deleteCustomerAction(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const id = String(formData.get("id") || "");
  if (!id) {
    redirect(`/customers?error=${encodeURIComponent("Cliente no valido.")}`);
  }

  try {
    const { error } = await supabase.from("clientes").delete().eq("id", id);
    if (error) {
      throw error;
    }
  } catch (error) {
    redirect(
      `/customers?error=${encodeURIComponent(
        getErrorMessage(error, "No se puede eliminar un cliente con pedidos asociados.")
      )}`
    );
  }

  revalidatePath("/");
  revalidatePath("/customers");
  redirect(`/customers?success=${encodeURIComponent("Cliente eliminado.")}`);
}

export type ImportState = {
  success?: boolean;
  summary?: string;
  errors?: string[];
};

export async function importCustomersAction(_: ImportState, formData: FormData): Promise<ImportState> {
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
  const validRows: Array<Record<string, string>> = [];

  for (const [index, record] of records.entries()) {
    const parsed = customerSchema.safeParse({
      nombre: record.nombre || record.name || "",
      email: record.email || "",
      telefono: record.telefono || record.phone || "",
      direccion: record.direccion || record.address || "",
      ciudad: record.ciudad || record.city || "",
      codigo_postal: record.codigo_postal || record.postal_code || "",
      pais: record.pais || record.country || "",
      notas: record.notas || record.notes || ""
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
      .from("clientes")
      .upsert(validRows, { onConflict: "email" })
      .select("id");

    if (error) {
      errors.push(`Error general de importacion: ${error.message}`);
    } else {
      imported = data?.length || validRows.length;
    }
  }

  revalidatePath("/");
  revalidatePath("/customers");

  return {
    success: imported > 0,
    summary: `Importacion finalizada. ${imported} clientes procesados correctamente y ${errors.length} filas con error.`,
    errors
  };
}
