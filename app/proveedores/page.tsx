import { fetchProviders } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";

export default async function ProvidersPage() {
  const providers = await fetchProviders();

  return (
    <div className="page-stack">
      <PageHeader
        title="Proveedores"
        description="Modulo preparado para trabajar hoy con ENPA y admitir nuevos proveedores en el futuro."
      />

      <div className="card table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Codigo</th>
              <th>Rol</th>
              <th style={{ textAlign: "right" }}>Productos</th>
              <th>Creado</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider) => (
              <tr key={provider.id}>
                <td>{provider.nombre}</td>
                <td>{provider.codigo}</td>
                <td>{provider.principal ? "Proveedor principal" : "Proveedor activo"}</td>
                <td style={{ textAlign: "right" }}>{provider.total_productos}</td>
                <td>{formatDate(provider.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
