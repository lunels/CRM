import { ProductForm } from "@/components/ProductForm";
import { Notice } from "@/components/Notice";
import { PageHeader } from "@/components/PageHeader";

export default async function NewProductPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="page-stack">
      <PageHeader
        title="Nuevo producto"
        description="Anade un producto con proveedor, referencia, familia, precio y datos comerciales."
      />
      <Notice message={params.error} tone="error" />
      <ProductForm />
    </div>
  );
}
