import { notFound } from "next/navigation";
import { ProductForm, type ProductFormData } from "@/components/ProductForm";
import { Notice } from "@/components/Notice";
import { PageHeader } from "@/components/PageHeader";
import { fetchProductById } from "@/lib/data";

export default async function EditProductPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  const productFormData: ProductFormData = {
    id: product.id,
    proveedor: product.proveedor,
    referencia: product.referencia,
    descripcion: product.descripcion,
    familia: product.familia,
    precio: product.precio,
    estado: product.estado,
    origen_familia: product.origen_familia,
    observaciones: product.observaciones
  };

  return (
    <div className="page-stack">
      <PageHeader title="Editar producto" description="Actualiza proveedor, referencia, familia y estado del producto." />
      <Notice message={query.error} tone="error" />
      <ProductForm product={productFormData} />
    </div>
  );
}
