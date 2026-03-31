import { prisma } from "@/lib/prisma";
import { getDisplayName } from "@/lib/utils";
import { Notice } from "@/components/Notice";
import { OrderForm } from "@/components/OrderForm";
import { PageHeader } from "@/components/PageHeader";

export default async function NewOrderPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const [customers, products] = await Promise.all([
    prisma.customer.findMany({ orderBy: { firstName: "asc" } }),
    prisma.product.findMany({ where: { isActive: true }, orderBy: { name: "asc" } })
  ]);

  if (customers.length === 0 || products.length === 0) {
    return (
      <div className="page-stack">
        <PageHeader title="Nuevo pedido" description="Crea un pedido con una o varias lineas de producto." />
        <Notice
          message="Necesitas al menos un cliente y un producto activo antes de crear pedidos."
          tone="error"
        />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader title="Nuevo pedido" description="Crea un pedido con una o varias lineas de producto." />
      <Notice message={params.error} tone="error" />
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
          date: new Date().toISOString().slice(0, 10),
          status: "PENDING"
        }}
      />
    </div>
  );
}
