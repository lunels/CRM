import Link from "next/link";
import { fetchOrders } from "@/lib/data";
import { formatDate, getDisplayName } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";

export default async function ComandasPage() {
  const orders = await fetchOrders();

  return (
    <div className="page-stack">
      <PageHeader
        title="Comandas"
        description="Documento para proveedor sin precios ni importes, listo para tramitar pedido."
      />

      <div className="card table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID comanda</th>
              <th>Cliente CRM</th>
              <th>Proveedor</th>
              <th>Fecha</th>
              <th style={{ textAlign: "center" }}>Lineas</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-cell">
                  No hay comandas generadas todavia.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{`COM-${order.numero}`}</td>
                  <td>{order.cliente ? getDisplayName(order.cliente) : "-"}</td>
                  <td>ENPA</td>
                  <td>{formatDate(order.fecha)}</td>
                  <td style={{ textAlign: "center" }}>{order.lineas?.length || 0}</td>
                  <td className="row-actions">
                    <Link href={`/comandas/${order.id}`} className="button button-secondary button-sm">
                      Ver comanda
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
