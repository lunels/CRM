import { notFound } from "next/navigation";
import { CustomerForm } from "@/components/CustomerForm";
import { Notice } from "@/components/Notice";
import { PageHeader } from "@/components/PageHeader";
import { fetchCustomerById } from "@/lib/data";

export default async function EditCustomerPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const customer = await fetchCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="page-stack">
      <PageHeader title="Editar cliente" description="Actualiza los datos del cliente seleccionado." />
      <Notice message={query.error} tone="error" />
      <CustomerForm customer={customer} />
    </div>
  );
}
