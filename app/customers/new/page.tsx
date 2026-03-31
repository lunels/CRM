import { CustomerForm } from "@/components/CustomerForm";
import { Notice } from "@/components/Notice";
import { PageHeader } from "@/components/PageHeader";

export default async function NewCustomerPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="page-stack">
      <PageHeader title="Nuevo cliente" description="Registra un nuevo cliente en el CRM." />
      <Notice message={params.error} tone="error" />
      <CustomerForm />
    </div>
  );
}
