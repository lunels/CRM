import Link from "next/link";
import { notFound } from "next/navigation";
import { updateOrderStatusAction } from "@/lib/actions/orders";
import { ORDER_STATUSES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, getDisplayName } from "@/lib/utils";
import { Notice } from "@/components/Notice";
import { PageHeader } from "@/components/PageHeader";

export default async function OrderDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          product: true
        }
      }
    }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="page-stack">
      <PageHeader
        title={`Pedido ${order.orderNumber}`}
        description={`Detalle completo del pedido para ${getDisplayName(order.customer)}.`}
        actions={[{ href: `/orders/${order.id}/edit`, label: "Editar pedido" }]}
      />

      <Notice message={query.success} />

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
              <strong>{getDisplayName(order.customer)}</strong>
            </div>
            <div>
              <span className="muted">Fecha</span>
              <strong>{formatDate(order.date)}</strong>
            </div>
            <div>
              <span className="muted">Estado actual</span>
              <strong>{order.status}</strong>
            </div>
          </div>

          <form action={updateOrderStatusAction} className="status-form">
            <input type="hidden" name="id" value={order.id} />
            <select className="input" name="status" defaultValue={order.status}>
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
              <strong>{formatCurrency(order.subtotal.toString())}</strong>
            </div>
            <div>
              <span className="muted">Impuestos</span>
              <strong>{formatCurrency(order.tax.toString())}</strong>
            </div>
            <div>
              <span className="muted">Total</span>
              <strong>{formatCurrency(order.total.toString())}</strong>
            </div>
          </div>

          {order.notes ? (
            <div>
              <span className="muted">Notas</span>
              <p>{order.notes}</p>
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
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product.name}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.unitPrice.toString())}</td>
                    <td>{formatCurrency(item.lineTotal.toString())}</td>
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
