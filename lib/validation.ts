import { z } from "zod";
import { ORDER_STATUSES } from "@/lib/constants";

export const customerSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio."),
  lastName: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email("Introduce un email valido."),
  phone: z.string().min(1, "El telefono es obligatorio."),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional()
});

export const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  sku: z.string().min(1, "La referencia es obligatoria."),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "El precio debe ser positivo."),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo."),
  category: z.string().optional(),
  isActive: z.boolean()
});

export const orderItemSchema = z.object({
  productId: z.string().min(1, "Selecciona un producto."),
  quantity: z.coerce.number().int().min(1, "La cantidad debe ser mayor que 0."),
  unitPrice: z.coerce.number().min(0, "El precio debe ser positivo.")
});

export const orderSchema = z.object({
  orderNumber: z.string().min(1, "El numero de pedido es obligatorio."),
  customerId: z.string().min(1, "Selecciona un cliente."),
  date: z.string().min(1, "La fecha es obligatoria."),
  status: z.enum(ORDER_STATUSES.map((status) => status.value) as [string, ...string[]]),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "El pedido debe tener al menos una linea.")
});
