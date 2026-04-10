import Link from "next/link";
import { fetchOrders } from "@/lib/data";
import { formatCurrency, formatDate, getDisplayName } from "@/lib/utils";
import { Notice } from "@/components/Notice";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";

function getStatusBadge(status: string) {
  const statusLower = status.toLowerCase();
  if (statusLower === "completado" || statusLower === "entregado") {
    return <span className="badge badge-success">{status}</span>;
  }
  if (statusLower === "pendiente" || statusLower === "en proceso") {
    return <span className="badge badge-warning">{status}</span>;
  }
  if (statusLower === "cancelado") {
    return <span className="badge badge-danger">{status}</span>;
  }
  return <span className="badge badge-default">{status}</span>;
}

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
        title="Presupuestos"
        description="Documento comercial para cliente con lineas, descuentos y total final."
        actions={[{ href: "/orders/new", label: "Nuevo presupuesto" }]}
      />

      <Notice message={params.success} />
      <Notice message={params.error} tone="error" />

      <SearchBar
        placeholder="Buscar por ID presupuesto, cliente o estado"
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
              <th>ID presupuesto</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th style={{ textAlign: "center" }}>Lineas</th>
              <th style={{ textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-cell">
                  No se han encontrado presupuestos.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link href={`/orders/${order.id}`}>{order.numero}</Link>
                  </td>
                  <td style={{ fontWeight: 500 }}>{order.cliente ? getDisplayName(order.cliente) : "-"}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{formatDate(order.fecha)}</td>
                  <td>{getStatusBadge(order.estado)}</td>
                  <td style={{ textAlign: "center", color: "var(--text-secondary)" }}>{order.lineas?.length || 0}</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>{formatCurrency(order.total)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
