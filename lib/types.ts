export type Customer = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string | null;
  ciudad: string | null;
  codigo_postal: string | null;
  pais: string | null;
  notas: string | null;
  created_at: string;
};

export type Product = {
  id: string;
  proveedor: string;
  referencia: string;
  descripcion: string | null;
  familia: string | null;
  origen_familia: string | null;
  precio: number;
  estado: string;
  observaciones: string | null;
  created_at: string;
};

export type OrderLine = {
  id: string;
  pedido_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  total: number;
  producto?: Pick<Product, "id" | "referencia" | "descripcion"> | null;
};

export type Order = {
  id: string;
  numero: string;
  cliente_id: string;
  fecha: string;
  estado: string;
  subtotal: number;
  impuestos: number;
  total: number;
  notas: string | null;
  created_at: string;
  cliente?: Pick<Customer, "id" | "nombre" | "email" | "telefono"> | null;
  lineas?: OrderLine[];
};

export type Provider = {
  id: string;
  nombre: string;
  codigo: string;
  principal: boolean;
  total_productos: number;
  created_at: string;
};

export type Commission = {
  id: string;
  fecha: string;
  proveedor: string;
  cliente: string;
  porcentaje: number;
  importe: number;
  observaciones: string | null;
};
