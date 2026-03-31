import { notFound } from "next/navigation";
import { ProductForm } from "@/components/ProductForm";
import { Notice } from "@/components/Notice";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

export default async function EditProductPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="page-stack">
      <PageHeader title="Editar producto" description="Actualiza el detalle del producto seleccionado." />
      <Notice message={query.error} tone="error" />
      <ProductForm product={product} />
    </div>
  );
}
