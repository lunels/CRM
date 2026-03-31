import { saveCustomerAction } from "@/lib/actions/customers";

type CustomerFormData = {
  id?: string;
  firstName?: string;
  lastName?: string | null;
  company?: string | null;
  email?: string;
  phone?: string;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  notes?: string | null;
};

export function CustomerForm({ customer }: { customer?: CustomerFormData }) {
  return (
    <form action={saveCustomerAction} className="card form-grid">
      <input type="hidden" name="id" value={customer?.id || ""} />

      <label className="field">
        <span>Nombre</span>
        <input className="input" name="firstName" defaultValue={customer?.firstName || ""} required />
      </label>

      <label className="field">
        <span>Apellidos</span>
        <input className="input" name="lastName" defaultValue={customer?.lastName || ""} />
      </label>

      <label className="field">
        <span>Razon social</span>
        <input className="input" name="company" defaultValue={customer?.company || ""} />
      </label>

      <label className="field">
        <span>Email</span>
        <input className="input" type="email" name="email" defaultValue={customer?.email || ""} required />
      </label>

      <label className="field">
        <span>Telefono</span>
        <input className="input" name="phone" defaultValue={customer?.phone || ""} required />
      </label>

      <label className="field">
        <span>Direccion</span>
        <input className="input" name="address" defaultValue={customer?.address || ""} />
      </label>

      <label className="field">
        <span>Ciudad</span>
        <input className="input" name="city" defaultValue={customer?.city || ""} />
      </label>

      <label className="field">
        <span>Codigo postal</span>
        <input className="input" name="postalCode" defaultValue={customer?.postalCode || ""} />
      </label>

      <label className="field">
        <span>Pais</span>
        <input className="input" name="country" defaultValue={customer?.country || ""} />
      </label>

      <label className="field field-full">
        <span>Notas</span>
        <textarea className="input textarea" name="notes" defaultValue={customer?.notes || ""} />
      </label>

      <div className="field-full form-actions">
        <button className="button" type="submit">
          {customer ? "Guardar cambios" : "Crear cliente"}
        </button>
      </div>
    </form>
  );
}
