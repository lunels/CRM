import Link from "next/link";
import { fetchDashboardStats, fetchRecentOrders } from "@/lib/data";
import { formatCurrency, formatDate, getDisplayName } from "@/lib/utils";
import { Notice } from "@/components/Notice";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";

export default async function DashboardPage() {
  try {
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
              <h3>Acciones rapidas</h3>
              <p className="muted">Atajos inspirados en el flujo generado con Anything.</p>
            </div>
          </div>
          <div className="quick-actions-grid">
            <Link href="/pedidos/nuevo" className="button">
              Crear pedido
            </Link>
            <Link href="/clientes/nuevo" className="button button-secondary">
              Crear cliente
            </Link>
            <Link href="/productos/nuevo" className="button button-secondary">
              Crear producto
            </Link>
            <Link href="/importar" className="button button-secondary">
              Importar CSV
            </Link>
          </div>
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
  } catch (error) {
    const message =
      typeof error === "object" && error && "message" in error && typeof error.message === "string"
        ? error.message
        : "No se pudo conectar con Supabase o leer el dashboard.";

    return (
      <div className="page-stack">
        <PageHeader title="Dashboard" description="Diagnostico de conexion con Supabase." />
        <Notice message={message} tone="error" />
        <section className="card form-stack">
          <p className="muted">
            Revisa las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`, y confirma que
            ejecutaste `supabase/schema.sql` en tu proyecto de Supabase.
          </p>
        </section>
      </div>
    );
  }
}
