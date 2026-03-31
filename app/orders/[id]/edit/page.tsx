import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
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
    prisma.customer.findMany({ orderBy: { firstName: "asc" } }),
    prisma.product.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.order.findUnique({
      where: { id },
      include: {
        items: true
      }
    })
  ]);

  if (!order) {
    notFound();
  }

  if (customers.length === 0 || products.length === 0) {
    return (
      <div className="page-stack">
        <PageHeader title="Editar pedido" description="Actualiza lineas, cliente o estado del pedido." />
        <Notice
          message="No hay clientes o productos activos suficientes para editar este pedido."
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
          name: product.name,
          sku: product.sku,
          price: Number(product.price)
        }))}
        order={{
          id: order.id,
          orderNumber: order.orderNumber,
          customerId: order.customerId,
          date: order.date.toISOString().slice(0, 10),
          status: order.status,
          notes: order.notes,
          items: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice)
          }))
        }}
      />
    </div>
  );
}
