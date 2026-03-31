import Link from "next/link";
import { Prisma } from "@prisma/client";
import { deleteCustomerAction } from "@/lib/actions/customers";
import { prisma } from "@/lib/prisma";
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

  const where: Prisma.CustomerWhereInput = query
    ? {
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
          { email: { contains: query } },
          { phone: { contains: query } }
        ]
      }
    : {};

  const orderBy =
    sort === "name"
      ? [{ firstName: "asc" as const }]
      : [{ createdAt: "desc" as const }];

  const customers = await prisma.customer.findMany({
    where,
    orderBy
  });

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
              <th />
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
                  <td>{getDisplayName(customer)}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.city || "-"}</td>
                  <td>{formatDate(customer.createdAt)}</td>
                  <td className="row-actions">
                    <Link href={`/customers/${customer.id}/edit`} className="button button-secondary">
                      Editar
                    </Link>
                    <form action={deleteCustomerAction}>
                      <input type="hidden" name="id" value={customer.id} />
                      <button className="button button-danger" type="submit">
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
