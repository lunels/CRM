import Link from "next/link";
import { deleteProductAction } from "@/lib/actions/products";
import { fetchProducts } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Notice } from "@/components/Notice";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; success?: string; error?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const sort = params.sort || "newest";
  const products = (await fetchProducts())
    .filter((product) => {
      if (!query) {
        return true;
      }
      const haystack =
        `${product.proveedor} ${product.referencia} ${product.descripcion || ""} ${product.familia || ""} ${product.origen_familia || ""}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    })
    .sort((left, right) => {
      if (sort === "reference") {
        return left.referencia.localeCompare(right.referencia, "es");
      }
      if (sort === "provider") {
        return left.proveedor.localeCompare(right.proveedor, "es");
      }
      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
    });

  return (
    <div className="page-stack">
      <PageHeader
        title="Productos"
        description="Catalogo completo por proveedor para buscar, filtrar y seleccionar productos con rapidez."
        actions={[
          { href: "/products/import", label: "Importar CSV", secondary: true },
          { href: "/products/new", label: "Nuevo producto" }
        ]}
      />

      <Notice message={params.success} />
      <Notice message={params.error} tone="error" />

      <SearchBar
        placeholder="Buscar por proveedor, referencia, descripcion o familia"
        search={query}
        sort={sort}
        sortOptions={[
          { value: "newest", label: "Mas recientes" },
          { value: "reference", label: "Referencia A-Z" },
          { value: "provider", label: "Proveedor A-Z" }
        ]}
      />

      <div className="card table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Referencia</th>
              <th>Descripcion</th>
              <th>Familia</th>
              <th style={{ textAlign: "right" }}>Precio</th>
              <th>Estado</th>
              <th>Origen familia</th>
              <th>Observaciones</th>
              <th style={{ width: "1%" }} />
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={9} className="empty-cell">
                  No se han encontrado productos.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <span style={{ fontWeight: 600 }}>{product.proveedor}</span>
                    <div className="table-subtext">{formatDate(product.created_at)}</div>
                  </td>
                  <td><code style={{ background: "var(--surface-alt)", padding: "0.125rem 0.375rem", borderRadius: "4px", fontSize: "0.8125rem" }}>{product.referencia}</code></td>
                  <td style={{ minWidth: "260px" }}>{product.descripcion || "-"}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{product.familia || "-"}</td>
                  <td style={{ textAlign: "right", fontWeight: 500 }}>{formatCurrency(product.precio)}</td>
                  <td>
                    <span className={`badge ${product.estado === "Activo" ? "badge-success" : product.estado === "Inactivo" ? "badge-default" : "badge-warning"}`}>
                      {product.estado}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>{product.origen_familia || "-"}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{product.observaciones || "-"}</td>
                  <td className="row-actions" style={{ whiteSpace: "nowrap" }}>
                    <Link href={`/products/${product.id}/edit`} className="button button-secondary button-sm">
                      Editar
                    </Link>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={product.id} />
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
