import { CsvImportForm } from "@/components/CsvImportForm";
import { PageHeader } from "@/components/PageHeader";
import { importCustomersAction } from "@/lib/actions/customers";

export default function ImportCustomersPage() {
  return (
    <div className="page-stack">
      <PageHeader
        title="Importar clientes"
        description="Sube un CSV para crear o actualizar clientes por email."
      />
      <CsvImportForm
        action={importCustomersAction}
        title="Importacion CSV de clientes"
        description="Si el email ya existe, el registro se actualizara con la informacion del CSV."
        expectedColumns="nombre,email,telefono,direccion,ciudad,codigo_postal,pais,notas"
      />
    </div>
  );
}
