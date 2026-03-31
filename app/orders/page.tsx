import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, getDisplayName } from "@/lib/utils";
import { Notice } from "@/components/Notice";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";

export default async function OrdersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; success?: string; error?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const sort = params.sort || "newest";
  const normalizedQuery = query.toUpperCase();
  const statusSearch = ["PENDING", "CONFIRMED", "SHIPPED", "COMPLETED", "CANCELLED"].includes(normalizedQuery)
    ? normalizedQuery
    : null;

  const where: Prisma.OrderWhereInput = query
    ? {
        OR: [
          { orderNumber: { contains: query } },
          { customer: { firstName: { contains: query } } },
          { customer: { lastName: { contains: query } } },
          { customer: { company: { contains: query } } },
          ...(statusSearch ? [{ status: { equals: statusSearch as never } }] : [])
        ]
      }
    : {};

  const orderBy =
    sort === "oldest"
      ? [{ date: "asc" as const }]
      : [{ date: "desc" as const }];

  const orders = await prisma.order.findMany({
    where,
    orderBy,
    include: {
      customer: true,
      items: true
    }
  });

  return (
    <div className="page-stack">
      <PageHeader
        title="Pedidos"
        description="Controla el estado de los pedidos y consulta su detalle."
        actions={[{ href: "/orders/new", label: "Nuevo pedido" }]}
      />

      <Notice message={params.success} />
      <Notice message={params.error} tone="error" />

      <SearchBar
        placeholder="Buscar por numero, cliente o estado"
        search={query}
        sort={sort}
        sortOptions={[
          { value: "newest", label: "Mas recientes" },
          { value: "oldest", label: "Mas antiguos" }
        ]}
      />

      <div className="card table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Lineas</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-cell">
                  No se han encontrado pedidos.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link href={`/orders/${order.id}`}>{order.orderNumber}</Link>
                  </td>
                  <td>{getDisplayName(order.customer)}</td>
                  <td>{formatDate(order.date)}</td>
                  <td>{order.status}</td>
                  <td>{order.items.length}</td>
                  <td>{formatCurrency(order.total.toString())}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
