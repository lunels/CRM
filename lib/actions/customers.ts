"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseCsv } from "@/lib/csv";
import { customerSchema } from "@/lib/validation";

function buildCustomerPayload(formData: FormData) {
  return {
    firstName: String(formData.get("firstName") || ""),
    lastName: String(formData.get("lastName") || ""),
    company: String(formData.get("company") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    address: String(formData.get("address") || ""),
    city: String(formData.get("city") || ""),
    postalCode: String(formData.get("postalCode") || ""),
    country: String(formData.get("country") || ""),
    notes: String(formData.get("notes") || "")
  };
}

function getCustomerRedirectPath(id?: string | null) {
  return id ? `/customers/${id}/edit` : "/customers/new";
}

export async function saveCustomerAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const parsed = customerSchema.safeParse(buildCustomerPayload(formData));

  if (!parsed.success) {
    redirect(`${getCustomerRedirectPath(id)}?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  try {
    if (id) {
      await prisma.customer.update({
        where: { id },
        data: parsed.data
      });
    } else {
      await prisma.customer.create({
        data: parsed.data
      });
    }
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("Unique constraint")
        ? "Ya existe un cliente con ese email."
        : "No se pudo guardar el cliente.";
    redirect(`${getCustomerRedirectPath(id)}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/");
  revalidatePath("/customers");
  redirect(`/customers?success=${encodeURIComponent(id ? "Cliente actualizado." : "Cliente creado.")}`);
}

export async function deleteCustomerAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) {
    redirect(`/customers?error=${encodeURIComponent("Cliente no valido.")}`);
  }

  try {
    await prisma.customer.delete({
      where: { id }
    });
  } catch {
    redirect(
      `/customers?error=${encodeURIComponent("No se puede eliminar un cliente con pedidos asociados.")}`
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
    const parsed = customerSchema.safeParse({
      firstName: record.nombre || record.first_name || record.firstname || record.name || "",
      lastName: record.apellidos || record.razon_social || record.last_name || "",
      company: record.razon_social || record.company || "",
      email: record.email || "",
      phone: record.telefono || record.phone || "",
      address: record.direccion || record.address || "",
      city: record.ciudad || record.city || "",
      postalCode: record.codigo_postal || record.postal_code || "",
      country: record.pais || record.country || "",
      notes: record.notas || record.notes || ""
    });

    if (!parsed.success) {
      errors.push(`Fila ${index + 2}: ${parsed.error.issues[0].message}`);
      continue;
    }

    try {
      await prisma.customer.upsert({
        where: { email: parsed.data.email },
        update: parsed.data,
        create: parsed.data
      });
      imported += 1;
    } catch {
      errors.push(`Fila ${index + 2}: no se pudo insertar el cliente.`);
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
