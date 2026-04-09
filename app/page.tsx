import Link from "next/link";
import { fetchDashboardStats, fetchRecentOrders } from "@/lib/data";
import { formatCurrency, formatDate, getDisplayName } from "@/lib/utils";
import { Notice } from "@/components/Notice";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";

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
          description="Resumen del negocio y acceso rapido a las operaciones habituales."
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
              <p className="muted">Accesos directos a las funciones mas utilizadas.</p>
            </div>
          </div>
          <div className="quick-actions-grid">
            <Link href="/orders/new" className="button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Nuevo pedido
            </Link>
            <Link href="/customers/new" className="button button-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
              Nuevo cliente
            </Link>
            <Link href="/products/new" className="button button-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 11.625l2.25-2.25M12 11.625l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              Nuevo producto
            </Link>
            <Link href="/importar" className="button button-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Importar CSV
            </Link>
          </div>
        </section>

        <section className="card">
          <div className="section-heading">
            <div>
              <h3>Pedidos recientes</h3>
              <p className="muted">Ultimos movimientos registrados en el sistema.</p>
            </div>
            <Link href="/orders" className="button button-secondary button-sm">
              Ver todos
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
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
                  <th style={{ textAlign: "right" }}>Total</th>
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
                      <td style={{ color: "var(--text-secondary)" }}>{formatDate(order.fecha)}</td>
                      <td>{getStatusBadge(order.estado)}</td>
                      <td style={{ textAlign: "right", fontWeight: 500 }}>{formatCurrency(order.total)}</td>
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
            Revisa las variables <code style={{ background: "var(--surface-alt)", padding: "0.125rem 0.375rem", borderRadius: "4px" }}>NEXT_PUBLIC_SUPABASE_URL</code> y <code style={{ background: "var(--surface-alt)", padding: "0.125rem 0.375rem", borderRadius: "4px" }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, y confirma que
            ejecutaste el schema SQL en tu proyecto de Supabase.
          </p>
        </section>
      </div>
    );
  }
}
