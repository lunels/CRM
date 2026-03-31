import { saveCustomerAction } from "@/lib/actions/customers";

type CustomerFormData = {
  id?: string;
  nombre?: string;
  email?: string;
  telefono?: string;
  direccion?: string | null;
  ciudad?: string | null;
  codigo_postal?: string | null;
  pais?: string | null;
  notas?: string | null;
};

export function CustomerForm({ customer }: { customer?: CustomerFormData }) {
  return (
    <form action={saveCustomerAction} className="card form-grid">
      <input type="hidden" name="id" value={customer?.id || ""} />

      <label className="field">
        <span>Nombre</span>
        <input className="input" name="nombre" defaultValue={customer?.nombre || ""} required />
      </label>

      <label className="field">
        <span>Email</span>
        <input className="input" type="email" name="email" defaultValue={customer?.email || ""} required />
      </label>

      <label className="field">
        <span>Telefono</span>
        <input className="input" name="telefono" defaultValue={customer?.telefono || ""} required />
      </label>

      <label className="field">
        <span>Direccion</span>
        <input className="input" name="direccion" defaultValue={customer?.direccion || ""} />
      </label>

      <label className="field">
        <span>Ciudad</span>
        <input className="input" name="ciudad" defaultValue={customer?.ciudad || ""} />
      </label>

      <label className="field">
        <span>Codigo postal</span>
        <input className="input" name="codigo_postal" defaultValue={customer?.codigo_postal || ""} />
      </label>

      <label className="field">
        <span>Pais</span>
        <input className="input" name="pais" defaultValue={customer?.pais || ""} />
      </label>

      <label className="field field-full">
        <span>Notas</span>
        <textarea className="input textarea" name="notas" defaultValue={customer?.notas || ""} />
      </label>

      <div className="field-full form-actions">
        <button className="button" type="submit">
          {customer ? "Guardar cambios" : "Crear cliente"}
        </button>
      </div>
    </form>
  );
}
