import { saveProductAction } from "@/lib/actions/products";

export type ProductFormData = {
  id?: string;
  proveedor?: string;
  referencia?: string;
  descripcion?: string | null;
  familia?: string | null;
  precio?: string | number;
  estado?: string;
  origen_familia?: string | null;
  observaciones?: string | null;
};

export function ProductForm({ product }: { product?: ProductFormData }) {
  return (
    <form action={saveProductAction} className="card form-grid">
      <input type="hidden" name="id" value={product?.id || ""} />

      <label className="field">
        <span>Proveedor</span>
        <input className="input" name="proveedor" defaultValue={product?.proveedor || "ENPA"} required />
      </label>

      <label className="field">
        <span>Referencia</span>
        <input className="input" name="referencia" defaultValue={product?.referencia || ""} required />
      </label>

      <label className="field">
        <span>Familia</span>
        <input className="input" name="familia" defaultValue={product?.familia || ""} />
      </label>

      <label className="field">
        <span>Precio</span>
        <input
          className="input"
          type="number"
          step="0.01"
          min="0"
          name="precio"
          defaultValue={product?.precio?.toString() || "0"}
          required
        />
      </label>

      <label className="field">
        <span>Estado</span>
        <select className="input" name="estado" defaultValue={product?.estado || "Activo"}>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
          <option value="Descatalogado">Descatalogado</option>
        </select>
      </label>

      <label className="field">
        <span>Origen familia</span>
        <input className="input" name="origen_familia" defaultValue={product?.origen_familia || ""} />
      </label>

      <label className="field field-full">
        <span>Descripcion</span>
        <textarea className="input textarea" name="descripcion" defaultValue={product?.descripcion || ""} />
      </label>

      <label className="field field-full">
        <span>Observaciones</span>
        <textarea className="input textarea" name="observaciones" defaultValue={product?.observaciones || ""} />
      </label>

      <div className="field-full form-actions">
        <button className="button" type="submit">
          {product ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}
