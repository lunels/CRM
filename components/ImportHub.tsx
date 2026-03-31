"use client";

import { useState } from "react";
import { importCustomersAction } from "@/lib/actions/customers";
import { importProductsAction } from "@/lib/actions/products";
import { CsvImportForm } from "@/components/CsvImportForm";

export function ImportHub({ initialTab = "clientes" }: { initialTab?: "clientes" | "productos" }) {
  const [tab, setTab] = useState<"clientes" | "productos">(initialTab);

  return (
    <div className="page-stack">
      <div className="card">
        <div className="page-header-actions">
          <button
            type="button"
            className={tab === "clientes" ? "button" : "button button-secondary"}
            onClick={() => setTab("clientes")}
          >
            Clientes
          </button>
          <button
            type="button"
            className={tab === "productos" ? "button" : "button button-secondary"}
            onClick={() => setTab("productos")}
          >
            Productos
          </button>
        </div>
      </div>

      {tab === "clientes" ? (
        <CsvImportForm
          action={importCustomersAction}
          title="Importacion CSV de clientes"
          description="Sube un archivo para crear o actualizar clientes por email."
          expectedColumns="nombre,email,telefono,direccion,ciudad,codigo_postal,pais,notas"
          tone="compact"
        />
      ) : (
        <CsvImportForm
          action={importProductsAction}
          title="Importacion CSV de productos"
          description="Sube un archivo para crear o actualizar productos por SKU."
          expectedColumns="nombre,sku,descripcion,precio,stock,categoria,activo"
          tone="compact"
        />
      )}
    </div>
  );
}
