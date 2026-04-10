import Link from "next/link";
import { notFound } from "next/navigation";
import { updateOrderStatusAction } from "@/lib/actions/orders";
import { ORDER_STATUSES } from "@/lib/constants";
import { fetchOrderById } from "@/lib/data";
import { formatCurrency, formatDate, getDisplayName } from "@/lib/utils";
import { Notice } from "@/components/Notice";
import { PageHeader } from "@/components/PageHeader";

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

export default async function OrderDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;

  const order = await fetchOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="page-stack">
      <PageHeader
        title={`Presupuesto ${order.numero}`}
        description={`Documento comercial preparado para ${order.cliente ? getDisplayName(order.cliente) : "cliente"}.`}
        actions={[
          { href: `/comandas/${order.id}`, label: "Ver comanda", secondary: true },
          { href: `/orders/${order.id}/edit`, label: "Editar presupuesto" }
        ]}
      />

      <Notice message={query.success} />
      <Notice message={query.error} tone="error" />

      <div className="detail-grid">
        <section className="card form-stack">
          <div className="section-heading">
            <div>
              <h3 style={{ fontWeight: 600 }}>Resumen del presupuesto</h3>
              <p className="muted">Informacion general del documento para cliente.</p>
            </div>
            <Link href="/presupuestos" className="button button-secondary button-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Volver
            </Link>
          </div>

          <div className="detail-list">
            <div>
              <span className="muted">Cliente</span>
              <strong style={{ fontSize: "1rem" }}>{order.cliente ? getDisplayName(order.cliente) : "-"}</strong>
            </div>
            <div>
              <span className="muted">Fecha</span>
              <strong style={{ fontSize: "1rem" }}>{formatDate(order.fecha)}</strong>
            </div>
            <div>
              <span className="muted">Estado actual</span>
              <div style={{ marginTop: "0.25rem" }}>{getStatusBadge(order.estado)}</div>
            </div>
          </div>

          <form action={updateOrderStatusAction} className="status-form" style={{ alignItems: "flex-end" }}>
            <input type="hidden" name="id" value={order.id} />
            <label className="field" style={{ flex: 1 }}>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Cambiar estado</span>
              <select className="input" name="status" defaultValue={order.estado}>
                {ORDER_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
            <button className="button" type="submit">
              Actualizar
            </button>
          </form>

          <div className="totals-card">
            <div>
              <span className="muted">Subtotal</span>
              <strong style={{ fontSize: "1.125rem" }}>{formatCurrency(order.subtotal)}</strong>
            </div>
            <div>
              <span className="muted">Descuento total aplicado</span>
              <strong style={{ fontSize: "1.125rem" }}>{formatCurrency(0)}</strong>
            </div>
            <div>
              <span className="muted">Total final</span>
              <strong style={{ fontSize: "1.25rem", color: "var(--primary)" }}>{formatCurrency(order.total)}</strong>
            </div>
          </div>

          {order.notas ? (
            <div className="card subtle-card compact-card">
              <span className="muted" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Notas</span>
              <p style={{ marginTop: "0.5rem", color: "var(--text-secondary)" }}>{order.notas}</p>
            </div>
          ) : null}
        </section>

        <section className="card">
          <div className="section-heading">
            <div>
              <h3 style={{ fontWeight: 600 }}>Lineas del presupuesto</h3>
              <p className="muted">Desglose visual para cliente con precios y descuento.</p>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Referencia proveedor</th>
                  <th>Descripcion</th>
                  <th style={{ textAlign: "center" }}>Cantidad</th>
                  <th style={{ textAlign: "right" }}>Precio antes dto.</th>
                  <th style={{ textAlign: "right" }}>Descuento</th>
                  <th style={{ textAlign: "right" }}>Precio final</th>
                </tr>
              </thead>
              <tbody>
                {order.lineas?.map((item) => (
                  <tr key={item.id}>
                    <td><code style={{ background: "var(--surface-alt)", padding: "0.125rem 0.375rem", borderRadius: "4px", fontSize: "0.8125rem" }}>{item.producto?.referencia || "-"}</code></td>
                    <td style={{ fontWeight: 500 }}>{item.producto?.descripcion || "-"}</td>
                    <td style={{ textAlign: "center" }}>{item.cantidad}</td>
                    <td style={{ textAlign: "right", color: "var(--text-secondary)" }}>{formatCurrency(item.precio_unitario)}</td>
                    <td style={{ textAlign: "right", color: "var(--muted)" }}>{formatCurrency(0)}</td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
