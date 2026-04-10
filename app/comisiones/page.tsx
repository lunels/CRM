import { fetchCommissionPreview } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";

export default async function ComisionesPage() {
  const commissions = await fetchCommissionPreview();

  return (
    <div className="page-stack">
      <PageHeader
        title="Comisiones"
        description="Modulo interno y privado del comercial para controlar porcentaje, importe y observaciones."
      />

      <div className="card subtle-card compact-card">
        <p className="muted">
          Vista inicial preparada para evolucionar a registro completo. El porcentaje puede variar entre 0% y 50%
          en cada operacion.
        </p>
      </div>

      <div className="card table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Proveedor</th>
              <th>Cliente</th>
              <th style={{ textAlign: "right" }}>% comision</th>
              <th style={{ textAlign: "right" }}>Importe</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {commissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-cell">
                  Aun no hay registros internos de comision.
                </td>
              </tr>
            ) : (
              commissions.map((commission) => (
                <tr key={commission.id}>
                  <td>{formatDate(commission.fecha)}</td>
                  <td>{commission.proveedor}</td>
                  <td>{commission.cliente}</td>
                  <td style={{ textAlign: "right" }}>{commission.porcentaje}%</td>
                  <td style={{ textAlign: "right" }}>{formatCurrency(commission.importe)}</td>
                  <td>{commission.observaciones || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
