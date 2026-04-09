import Link from "next/link";
import { deleteCustomerAction } from "@/lib/actions/customers";
import { fetchCustomers } from "@/lib/data";
import { formatDate, getDisplayName } from "@/lib/utils";
import { Notice } from "@/components/Notice";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";

export default async function CustomersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; success?: string; error?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const sort = params.sort || "newest";
  const customers = (await fetchCustomers())
    .filter((customer) => {
      if (!query) {
        return true;
      }
      const haystack = `${customer.nombre} ${customer.email} ${customer.telefono}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    })
    .sort((left, right) =>
      sort === "name"
        ? left.nombre.localeCompare(right.nombre, "es")
        : new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
    );

  return (
    <div className="page-stack">
      <PageHeader
        title="Clientes"
        description="Consulta, crea y actualiza la base de clientes."
        actions={[
          { href: "/customers/import", label: "Importar CSV", secondary: true },
          { href: "/customers/new", label: "Nuevo cliente" }
        ]}
      />

      <Notice message={params.success} />
      <Notice message={params.error} tone="error" />

      <SearchBar
        placeholder="Buscar por nombre, email o telefono"
        search={query}
        sort={sort}
        sortOptions={[
          { value: "newest", label: "Mas recientes" },
          { value: "name", label: "Nombre A-Z" }
        ]}
      />

      <div className="card table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Email</th>
              <th>Telefono</th>
              <th>Ciudad</th>
              <th>Creado</th>
              <th style={{ width: "1%" }} />
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-cell">
                  No se han encontrado clientes.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td style={{ fontWeight: 500 }}>{getDisplayName(customer)}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{customer.email}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{customer.telefono}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{customer.ciudad || "-"}</td>
                  <td style={{ color: "var(--muted)" }}>{formatDate(customer.created_at)}</td>
                  <td className="row-actions" style={{ whiteSpace: "nowrap" }}>
                    <Link href={`/customers/${customer.id}/edit`} className="button button-secondary button-sm">
                      Editar
                    </Link>
                    <form action={deleteCustomerAction}>
                      <input type="hidden" name="id" value={customer.id} />
                      <button className="button button-danger button-sm" type="submit">
                        Eliminar
                      </button>
                    </form>
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
