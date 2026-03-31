import { saveProductAction } from "@/lib/actions/products";

export type ProductFormData = {
  id?: string;
  nombre?: string;
  sku?: string;
  descripcion?: string | null;
  precio?: string | number;
  stock?: number;
  categoria?: string | null;
  activo?: boolean;
};

export function ProductForm({ product }: { product?: ProductFormData }) {
  return (
    <form action={saveProductAction} className="card form-grid">
      <input type="hidden" name="id" value={product?.id || ""} />

      <label className="field">
        <span>Nombre</span>
        <input className="input" name="nombre" defaultValue={product?.nombre || ""} required />
      </label>

      <label className="field">
        <span>SKU / referencia</span>
        <input className="input" name="sku" defaultValue={product?.sku || ""} required />
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
        <span>Stock</span>
        <input className="input" type="number" min="0" name="stock" defaultValue={product?.stock || 0} required />
      </label>

      <label className="field">
        <span>Categoria</span>
        <input className="input" name="categoria" defaultValue={product?.categoria || ""} />
      </label>

      <label className="field checkbox-field">
        <input type="checkbox" name="activo" defaultChecked={product?.activo ?? true} />
        <span>Producto activo</span>
      </label>

      <label className="field field-full">
        <span>Descripcion</span>
        <textarea className="input textarea" name="descripcion" defaultValue={product?.descripcion || ""} />
      </label>

      <div className="field-full form-actions">
        <button className="button" type="submit">
          {product ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}
