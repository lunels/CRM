import Link from "next/link";
import { notFound } from "next/navigation";
import { updateOrderStatusAction } from "@/lib/actions/orders";
import { ORDER_STATUSES } from "@/lib/constants";
import { fetchOrderById } from "@/lib/data";
import { formatCurrency, formatDate, getDisplayName } from "@/lib/utils";
import { Notice } from "@/components/Notice";
import { PageHeader } from "@/components/PageHeader";

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
        title={`Pedido ${order.numero}`}
        description={`Detalle completo del pedido para ${order.cliente ? getDisplayName(order.cliente) : "cliente"}.`}
        actions={[{ href: `/orders/${order.id}/edit`, label: "Editar pedido" }]}
      />

      <Notice message={query.success} />
      <Notice message={query.error} tone="error" />

      <div className="detail-grid">
        <section className="card form-stack">
          <div className="section-heading">
            <div>
              <h3>Resumen</h3>
              <p className="muted">Informacion general y estado del pedido.</p>
            </div>
            <Link href="/orders" className="button button-secondary">
              Volver
            </Link>
          </div>

          <div className="detail-list">
            <div>
              <span className="muted">Cliente</span>
              <strong>{order.cliente ? getDisplayName(order.cliente) : "-"}</strong>
            </div>
            <div>
              <span className="muted">Fecha</span>
              <strong>{formatDate(order.fecha)}</strong>
            </div>
            <div>
              <span className="muted">Estado actual</span>
              <strong>{order.estado}</strong>
            </div>
          </div>

          <form action={updateOrderStatusAction} className="status-form">
            <input type="hidden" name="id" value={order.id} />
            <select className="input" name="status" defaultValue={order.estado}>
              {ORDER_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <button className="button" type="submit">
              Actualizar estado
            </button>
          </form>

          <div className="detail-list">
            <div>
              <span className="muted">Subtotal</span>
              <strong>{formatCurrency(order.subtotal)}</strong>
            </div>
            <div>
              <span className="muted">Impuestos</span>
              <strong>{formatCurrency(order.impuestos)}</strong>
            </div>
            <div>
              <span className="muted">Total</span>
              <strong>{formatCurrency(order.total)}</strong>
            </div>
          </div>

          {order.notas ? (
            <div>
              <span className="muted">Notas</span>
              <p>{order.notas}</p>
            </div>
          ) : null}
        </section>

        <section className="card">
          <div className="section-heading">
            <div>
              <h3>Lineas del pedido</h3>
              <p className="muted">Desglose de productos incluidos.</p>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Total linea</th>
                </tr>
              </thead>
              <tbody>
                {order.lineas?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.producto?.nombre || "-"}</td>
                    <td>{item.cantidad}</td>
                    <td>{formatCurrency(item.precio_unitario)}</td>
                    <td>{formatCurrency(item.total)}</td>
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
