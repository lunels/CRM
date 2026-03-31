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
    nombre: product.nombre,
    sku: product.sku,
    descripcion: product.descripcion,
    precio: product.precio,
    stock: product.stock,
    categoria: product.categoria,
    activo: product.activo
  };

  return (
    <div className="page-stack">
      <PageHeader title="Editar producto" description="Actualiza el detalle del producto seleccionado." />
      <Notice message={query.error} tone="error" />
      <ProductForm product={productFormData} />
    </div>
  );
}
