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
      const haystack = `${product.nombre} ${product.sku} ${product.categoria || ""}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    })
    .sort((left, right) => {
      if (sort === "name") {
        return left.nombre.localeCompare(right.nombre, "es");
      }
      if (sort === "stock") {
        return left.stock - right.stock;
      }
      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
    });

  return (
    <div className="page-stack">
      <PageHeader
        title="Productos"
        description="Gestiona el catalogo y el stock disponible."
        actions={[
          { href: "/products/import", label: "Importar CSV", secondary: true },
          { href: "/products/new", label: "Nuevo producto" }
        ]}
      />

      <Notice message={params.success} />
      <Notice message={params.error} tone="error" />

      <SearchBar
        placeholder="Buscar por nombre, SKU o categoria"
        search={query}
        sort={sort}
        sortOptions={[
          { value: "newest", label: "Mas recientes" },
          { value: "name", label: "Nombre A-Z" },
          { value: "stock", label: "Menor stock" }
        ]}
      />

      <div className="card table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>SKU</th>
              <th>Categoria</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-cell">
                  No se han encontrado productos.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.nombre}</strong>
                    <div className="table-subtext">{formatDate(product.created_at)}</div>
                  </td>
                  <td>{product.sku}</td>
                  <td>{product.categoria || "-"}</td>
                  <td>{formatCurrency(product.precio)}</td>
                  <td>{product.stock}</td>
                  <td>{product.activo ? "Activo" : "Inactivo"}</td>
                  <td className="row-actions">
                    <Link href={`/products/${product.id}/edit`} className="button button-secondary">
                      Editar
                    </Link>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={product.id} />
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
