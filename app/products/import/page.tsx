import { CsvImportForm } from "@/components/CsvImportForm";
import { PageHeader } from "@/components/PageHeader";
import { importProductsAction } from "@/lib/actions/products";

export default function ImportProductsPage() {
  return (
    <div className="page-stack">
      <PageHeader
        title="Importar productos"
        description="Sube un CSV para crear o actualizar productos por SKU."
      />
      <CsvImportForm
        action={importProductsAction}
        title="Importacion CSV de productos"
        description="Si el SKU ya existe, el producto se actualizara con los nuevos datos."
        expectedColumns="nombre,sku,descripcion,precio,stock,categoria,activo"
      />
    </div>
  );
}
