import { z } from "zod";
import { ORDER_STATUSES } from "@/lib/constants";

export const customerSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  email: z.string().email("Introduce un email valido."),
  telefono: z.string().min(1, "El telefono es obligatorio."),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  codigo_postal: z.string().optional(),
  pais: z.string().optional(),
  notas: z.string().optional()
});

export const productSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  sku: z.string().min(1, "La referencia es obligatoria."),
  descripcion: z.string().optional(),
  precio: z.coerce.number().min(0, "El precio debe ser positivo."),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo."),
  categoria: z.string().optional(),
  activo: z.boolean()
});

export const orderItemSchema = z.object({
  producto_id: z.string().min(1, "Selecciona un producto."),
  cantidad: z.coerce.number().int().min(1, "La cantidad debe ser mayor que 0."),
  precio_unitario: z.coerce.number().min(0, "El precio debe ser positivo.")
});

export const orderSchema = z.object({
  numero: z.string().min(1, "El numero de pedido es obligatorio."),
  cliente_id: z.string().min(1, "Selecciona un cliente."),
  fecha: z.string().min(1, "La fecha es obligatoria."),
  estado: z.enum(ORDER_STATUSES.map((status) => status.value) as [string, ...string[]]),
  notas: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "El pedido debe tener al menos una linea.")
});
