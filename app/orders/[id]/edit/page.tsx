import { notFound } from "next/navigation";
import { fetchActiveProducts, fetchCustomers, fetchOrderById } from "@/lib/data";
import { getDisplayName } from "@/lib/utils";
import { Notice } from "@/components/Notice";
import { OrderForm } from "@/components/OrderForm";
import { PageHeader } from "@/components/PageHeader";

export default async function EditOrderPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;

  const [customers, products, order] = await Promise.all([
    fetchCustomers(),
    fetchActiveProducts(),
    fetchOrderById(id)
  ]);

  if (!order) {
    notFound();
  }

  if (customers.length === 0 || products.length === 0) {
    return (
      <div className="page-stack">
        <PageHeader title="Editar pedido" description="Actualiza lineas, cliente o estado del pedido." />
        <Notice
          message="No hay clientes o productos disponibles suficientes para editar este pedido."
          tone="error"
        />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader title="Editar pedido" description="Actualiza lineas, cliente o estado del pedido." />
      <Notice message={query.error} tone="error" />
      <OrderForm
        customers={customers.map((customer) => ({
          id: customer.id,
          label: getDisplayName(customer)
        }))}
        products={products.map((product) => ({
          id: product.id,
          referencia: product.referencia,
          descripcion: product.descripcion || "Sin descripcion",
          precio: product.precio
        }))}
        order={{
          id: order.id,
          numero: order.numero,
          cliente_id: order.cliente_id,
          fecha: order.fecha.slice(0, 10),
          estado: order.estado,
          notas: order.notas,
          items: (order.lineas || []).map((item) => ({
            producto_id: item.producto_id,
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario
          }))
        }}
      />
    </div>
  );
}
