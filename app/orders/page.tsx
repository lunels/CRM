import Link from "next/link";
import { fetchOrders } from "@/lib/data";
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
  const orders = (await fetchOrders())
    .filter((order) => {
      if (!query) {
        return true;
      }
      const haystack = `${order.numero} ${order.estado} ${order.cliente?.nombre || ""}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    })
    .sort((left, right) =>
      sort === "oldest"
        ? new Date(left.fecha).getTime() - new Date(right.fecha).getTime()
        : new Date(right.fecha).getTime() - new Date(left.fecha).getTime()
    );

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
                      <Link href={`/orders/${order.id}`}>{order.numero}</Link>
                    </td>
                    <td>{order.cliente ? getDisplayName(order.cliente) : "-"}</td>
                    <td>{formatDate(order.fecha)}</td>
                    <td>{order.estado}</td>
                    <td>{order.lineas?.length || 0}</td>
                    <td>{formatCurrency(order.total)}</td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
