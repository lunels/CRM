import { ImportHub } from "@/components/ImportHub";
import { PageHeader } from "@/components/PageHeader";

export default async function ImportarPage({
  searchParams
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const params = await searchParams;
  const tab = params.tipo === "productos" ? "productos" : "clientes";

  return (
    <div className="page-stack">
      <PageHeader
        title="Importar desde CSV"
        description="Pantalla unificada adaptada desde Anything para importar clientes o productos."
      />
      <ImportHub initialTab={tab} />
    </div>
  );
}
