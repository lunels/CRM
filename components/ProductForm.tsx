import { saveProductAction } from "@/lib/actions/products";

type ProductFormData = {
  id?: string;
  name?: string;
  sku?: string;
  description?: string | null;
  price?: string | number;
  stock?: number;
  category?: string | null;
  isActive?: boolean;
};

export function ProductForm({ product }: { product?: ProductFormData }) {
  return (
    <form action={saveProductAction} className="card form-grid">
      <input type="hidden" name="id" value={product?.id || ""} />

      <label className="field">
        <span>Nombre</span>
        <input className="input" name="name" defaultValue={product?.name || ""} required />
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
          name="price"
          defaultValue={product?.price?.toString() || "0"}
          required
        />
      </label>

      <label className="field">
        <span>Stock</span>
        <input className="input" type="number" min="0" name="stock" defaultValue={product?.stock || 0} required />
      </label>

      <label className="field">
        <span>Categoria</span>
        <input className="input" name="category" defaultValue={product?.category || ""} />
      </label>

      <label className="field checkbox-field">
        <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} />
        <span>Producto activo</span>
      </label>

      <label className="field field-full">
        <span>Descripcion</span>
        <textarea className="input textarea" name="description" defaultValue={product?.description || ""} />
      </label>

      <div className="field-full form-actions">
        <button className="button" type="submit">
          {product ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}
