import { CsvImportForm } from "@/components/CsvImportForm";
import { PageHeader } from "@/components/PageHeader";
import { importProductsAction } from "@/lib/actions/products";

export default function ImportProductsPage() {
  return (
    <div className="page-stack">
      <PageHeader
        title="Importar productos"
        description="Sube un CSV para crear o actualizar productos por referencia."
      />
      <CsvImportForm
        action={importProductsAction}
        title="Importacion CSV de productos"
        description="Si la referencia ya existe, el producto se actualizara con los nuevos datos."
        expectedColumns="proveedor,referencia,descripcion,familia,precio,estado,origen_familia,observaciones"
      />
    </div>
  );
}
