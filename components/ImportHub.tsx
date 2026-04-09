"use client";

import { useState } from "react";
import { importCustomersAction } from "@/lib/actions/customers";
import { importProductsAction } from "@/lib/actions/products";
import { CsvImportForm } from "@/components/CsvImportForm";

export function ImportHub({ initialTab = "clientes" }: { initialTab?: "clientes" | "productos" }) {
  const [tab, setTab] = useState<"clientes" | "productos">(initialTab);

  return (
    <div className="page-stack">
      <div className="card" style={{ padding: "0.5rem" }}>
        <div className="page-header-actions" style={{ gap: "0.25rem" }}>
          <button
            type="button"
            className={tab === "clientes" ? "button" : "button button-secondary"}
            onClick={() => setTab("clientes")}
            style={{ borderRadius: "8px" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            Clientes
          </button>
          <button
            type="button"
            className={tab === "productos" ? "button" : "button button-secondary"}
            onClick={() => setTab("productos")}
            style={{ borderRadius: "8px" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
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
