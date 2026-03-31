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
  name: string;
  sku: string;
  price: number;
};

type OrderFormValue = {
  id?: string;
  orderNumber?: string;
  customerId?: string;
  date?: string;
  status?: string;
  notes?: string | null;
  items?: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
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
      : [{ productId: products[0]?.id || "", quantity: 1, unitPrice: products[0]?.price || 0 }]
  );

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxes = subtotal * TAX_RATE;
    const total = subtotal + taxes;
    return { subtotal, taxes, total };
  }, [items]);

  function updateItem(index: number, key: "productId" | "quantity" | "unitPrice", value: string) {
    setItems((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        if (key === "productId") {
          const product = products.find((candidate) => candidate.id === value);
          return {
            productId: value,
            quantity: item.quantity,
            unitPrice: product?.price ?? item.unitPrice
          };
        }

        if (key === "quantity") {
          return {
            ...item,
            quantity: Math.max(1, Number(value || 1))
          };
        }

        return {
          ...item,
          unitPrice: Math.max(0, Number(value || 0))
        };
      })
    );
  }

  function addLine() {
    setItems((current) => [
      ...current,
      { productId: products[0]?.id || "", quantity: 1, unitPrice: products[0]?.price || 0 }
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
          <input className="input" name="orderNumber" defaultValue={order?.orderNumber || ""} required />
        </label>

        <label className="field">
          <span>Cliente</span>
          <select className="input" name="customerId" defaultValue={order?.customerId || customers[0]?.id || ""} required>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Fecha</span>
          <input className="input" type="date" name="date" defaultValue={order?.date || ""} required />
        </label>

        <label className="field">
          <span>Estado</span>
          <select className="input" name="status" defaultValue={order?.status || "PENDING"}>
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
          <div className="line-item-row" key={`${item.productId}-${index}`}>
            <select
              className="input"
              value={item.productId}
              onChange={(event) => updateItem(index, "productId", event.target.value)}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
            <input
              className="input"
              type="number"
              min="1"
              value={item.quantity}
              onChange={(event) => updateItem(index, "quantity", event.target.value)}
            />
            <input
              className="input"
              type="number"
              step="0.01"
              min="0"
              value={item.unitPrice}
              onChange={(event) => updateItem(index, "unitPrice", event.target.value)}
            />
            <div className="line-total">{formatCurrency(item.quantity * item.unitPrice)}</div>
            <button className="button button-danger" type="button" onClick={() => removeLine(index)}>
              Quitar
            </button>
          </div>
        ))}
      </div>

      <label className="field">
        <span>Notas</span>
        <textarea className="input textarea" name="notes" defaultValue={order?.notes || ""} />
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
