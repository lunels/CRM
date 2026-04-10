"use client";

import { useMemo, useState } from "react";
import { saveOrderAction } from "@/lib/actions/orders";
import { ORDER_STATUSES, TAX_RATE } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

type CustomerOption = {
  id: string;
  label: string;
};

type ProductOption = {
  id: string;
  referencia: string;
  descripcion: string;
  precio: number;
};

type OrderFormValue = {
  id?: string;
  numero?: string;
  cliente_id?: string;
  fecha?: string;
  estado?: string;
  notas?: string | null;
  items?: Array<{
    producto_id: string;
    cantidad: number;
    precio_unitario: number;
  }>;
};

export function OrderForm({
  customers,
  products,
  order
}: {
  customers: CustomerOption[];
  products: ProductOption[];
  order?: OrderFormValue;
}) {
  const [items, setItems] = useState(
    order?.items?.length
      ? order.items
      : [{ producto_id: products[0]?.id || "", cantidad: 1, precio_unitario: products[0]?.precio || 0 }]
  );

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.cantidad * item.precio_unitario, 0);
    const taxes = subtotal * TAX_RATE;
    const total = subtotal + taxes;
    return { subtotal, taxes, total };
  }, [items]);

  function updateItem(index: number, key: "producto_id" | "cantidad" | "precio_unitario", value: string) {
    setItems((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        if (key === "producto_id") {
          const product = products.find((candidate) => candidate.id === value);
          return {
            producto_id: value,
            cantidad: item.cantidad,
            precio_unitario: product?.precio ?? item.precio_unitario
          };
        }

        if (key === "cantidad") {
          return {
            ...item,
            cantidad: Math.max(1, Number(value || 1))
          };
        }

        return {
          ...item,
          precio_unitario: Math.max(0, Number(value || 0))
        };
      })
    );
  }

  function addLine() {
    setItems((current) => [
      ...current,
      { producto_id: products[0]?.id || "", cantidad: 1, precio_unitario: products[0]?.precio || 0 }
    ]);
  }

  function removeLine(index: number) {
    setItems((current) => (current.length > 1 ? current.filter((_, itemIndex) => itemIndex !== index) : current));
  }

  return (
    <form action={saveOrderAction} className="card form-stack">
      <input type="hidden" name="id" value={order?.id || ""} />
      <input type="hidden" name="itemsJson" value={JSON.stringify(items)} />

      <div className="form-grid">
        <label className="field">
          <span>Numero de pedido</span>
          <input className="input" name="numero" defaultValue={order?.numero || ""} required />
        </label>

        <label className="field">
          <span>Cliente</span>
          <select className="input" name="cliente_id" defaultValue={order?.cliente_id || customers[0]?.id || ""} required>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Fecha</span>
          <input className="input" type="date" name="fecha" defaultValue={order?.fecha || ""} required />
        </label>

        <label className="field">
          <span>Estado</span>
          <select className="input" name="estado" defaultValue={order?.estado || "PENDING"}>
            {ORDER_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="line-items">
        <div className="line-items-header">
          <div>
            <h3>Lineas del pedido</h3>
            <p className="muted">Ajusta cantidades y precios antes de guardar.</p>
          </div>
          <button className="button button-secondary" type="button" onClick={addLine}>
            Anadir linea
          </button>
        </div>

        {items.map((item, index) => (
          <div className="line-item-row" key={`${item.producto_id}-${index}`}>
            <select
              className="input"
              value={item.producto_id}
              onChange={(event) => updateItem(index, "producto_id", event.target.value)}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.referencia} - {product.descripcion}
                </option>
              ))}
            </select>
            <input
              className="input"
              type="number"
              min="1"
              value={item.cantidad}
              onChange={(event) => updateItem(index, "cantidad", event.target.value)}
            />
            <input
              className="input"
              type="number"
              step="0.01"
              min="0"
              value={item.precio_unitario}
              onChange={(event) => updateItem(index, "precio_unitario", event.target.value)}
            />
            <div className="line-total">{formatCurrency(item.cantidad * item.precio_unitario)}</div>
            <button className="button button-danger" type="button" onClick={() => removeLine(index)}>
              Quitar
            </button>
          </div>
        ))}
      </div>

      <label className="field">
        <span>Notas</span>
        <textarea className="input textarea" name="notas" defaultValue={order?.notas || ""} />
      </label>

      <div className="totals-card">
        <div>
          <span className="muted">Subtotal</span>
          <strong>{formatCurrency(totals.subtotal)}</strong>
        </div>
        <div>
          <span className="muted">Impuestos (21%)</span>
          <strong>{formatCurrency(totals.taxes)}</strong>
        </div>
        <div>
          <span className="muted">Total</span>
          <strong>{formatCurrency(totals.total)}</strong>
        </div>
      </div>

      <div className="form-actions">
        <button className="button" type="submit">
          {order ? "Guardar pedido" : "Crear pedido"}
        </button>
      </div>
    </form>
  );
}
