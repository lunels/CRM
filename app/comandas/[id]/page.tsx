import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchOrderById } from "@/lib/data";
import { formatDate, getDisplayName } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";

export default async function ComandaDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await fetchOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="page-stack">
      <PageHeader
        title={`Comanda COM-${order.numero}`}
        description="Documento para proveedor con referencias, cantidades y observaciones comerciales."
        actions={[{ href: `/orders/${order.id}`, label: "Ver presupuesto", secondary: true }]}
      />

      <div className="detail-grid">
        <section className="card form-stack">
          <div className="section-heading">
            <div>
              <h3>Resumen de la comanda</h3>
              <p className="muted">Documento profesional para enviar al proveedor.</p>
            </div>
            <Link href="/comandas" className="button button-secondary button-sm">
              Volver
            </Link>
          </div>

          <div className="detail-list">
            <div>
              <span className="muted">Fecha</span>
              <strong>{formatDate(order.fecha)}</strong>
            </div>
            <div>
              <span className="muted">ID cliente CRM</span>
              <strong>{order.cliente_id}</strong>
            </div>
            <div>
              <span className="muted">Proveedor</span>
              <strong>ENPA</strong>
            </div>
          </div>

          <div className="card subtle-card compact-card">
            <span className="muted">Datos del cliente y del comercio</span>
            <p style={{ marginTop: "0.5rem" }}>{order.cliente ? getDisplayName(order.cliente) : "Cliente no disponible"}</p>
            <p className="muted">{order.cliente?.telefono || "Sin telefono"}</p>
            <p className="muted">{order.cliente?.email || "Sin email"}</p>
          </div>

          {order.notas ? (
            <div className="card subtle-card compact-card">
              <span className="muted">Observaciones</span>
              <p style={{ marginTop: "0.5rem" }}>{order.notas}</p>
            </div>
          ) : null}
        </section>

        <section className="card">
          <div className="section-heading">
            <div>
              <h3>Lineas de producto</h3>
              <p className="muted">Sin precios ni totales, solo lo necesario para proveedor.</p>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Referencia</th>
                  <th>Descripcion</th>
                  <th style={{ textAlign: "center" }}>Cantidad</th>
                  <th>Dato comercial</th>
                </tr>
              </thead>
              <tbody>
                {order.lineas?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.producto?.referencia || "-"}</td>
                    <td>{item.producto?.descripcion || "-"}</td>
                    <td style={{ textAlign: "center" }}>{item.cantidad}</td>
                    <td>Descuento cliente aplicado: 0%</td>
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
