import Link from "next/link";
import { fetchDashboardStats, fetchRecentOrders } from "@/lib/data";
import { formatCurrency, formatDate, getDisplayName } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";

export default async function DashboardPage() {
  const [{ customerCount, productCount, orderCount }, recentOrders] = await Promise.all([
    fetchDashboardStats(),
    fetchRecentOrders()
  ]);

  return (
    <div className="page-stack">
      <PageHeader
        title="Dashboard"
        description="Resumen rapido del negocio y acceso directo a las operaciones mas habituales."
      />

      <section className="stats-grid">
        <StatCard label="Clientes" value={customerCount} help="Base de clientes registrada" />
        <StatCard label="Productos" value={productCount} help="Catalogo disponible" />
        <StatCard label="Pedidos" value={orderCount} help="Pedidos creados en el sistema" />
      </section>

      <section className="card">
        <div className="section-heading">
          <div>
            <h3>Pedidos recientes</h3>
            <p className="muted">Ultimos movimientos registrados.</p>
          </div>
          <Link href="/orders" className="button button-secondary">
            Ver todos
          </Link>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-cell">
                    No hay pedidos todavia.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link href={`/orders/${order.id}`}>{order.numero}</Link>
                    </td>
                    <td>{order.cliente ? getDisplayName(order.cliente) : "-"}</td>
                    <td>{formatDate(order.fecha)}</td>
                    <td>{order.estado}</td>
                    <td>{formatCurrency(order.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
