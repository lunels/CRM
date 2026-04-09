"use client";

import { useActionState, useState } from "react";
import type { ImportState } from "@/lib/actions/customers";
import { parseCsv } from "@/lib/csv";

const initialState: ImportState = {
  success: false,
  summary: "",
  errors: []
};

export function CsvImportForm({
  action,
  title,
  description,
  expectedColumns,
  tone = "default"
}: {
  action: (state: ImportState, formData: FormData) => Promise<ImportState>;
  title: string;
  description: string;
  expectedColumns: string;
  tone?: "default" | "compact";
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [fileName, setFileName] = useState("");
  const [previewRows, setPreviewRows] = useState<Array<Record<string, string>>>([]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setFileName("");
      setPreviewRows([]);
      return;
    }

    setFileName(file.name);
    const text = await file.text();
    setPreviewRows(parseCsv(text).slice(0, 5));
  }

  return (
    <div className="card form-stack">
      <div>
        <h3 style={{ fontWeight: 600 }}>{title}</h3>
        <p className="muted" style={{ marginTop: "0.25rem" }}>{description}</p>
      </div>

      <div>
        <span className="muted" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Columnas esperadas</span>
        <div className="code-block" style={{ marginTop: "0.5rem" }}>{expectedColumns}</div>
      </div>

      <form action={formAction} className="form-stack">
        <label className="field">
          <span>Archivo CSV</span>
          <input
            className="input"
            type="file"
            name="file"
            accept=".csv,text/csv"
            required
            onChange={handleFileChange}
            style={{ cursor: "pointer" }}
          />
        </label>

        <button className="button" type="submit" disabled={pending} style={{ opacity: pending ? 0.7 : 1 }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          {pending ? "Importando..." : "Importar CSV"}
        </button>
      </form>

      {fileName ? (
        <div className={`card subtle-card${tone === "compact" ? " compact-card" : ""}`}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "18px", height: "18px", color: "var(--accent)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <h4 style={{ fontWeight: 600, fontSize: "0.875rem" }}>Vista previa</h4>
            <span className="badge badge-default" style={{ marginLeft: "auto" }}>{fileName}</span>
          </div>
          {previewRows.length > 0 ? (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    {Object.keys(previewRows[0]).map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, index) => (
                    <tr key={`${fileName}-${index}`}>
                      {Object.keys(previewRows[0]).map((column) => (
                        <td key={`${column}-${index}`}>{row[column] || "-"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted">No se han podido leer filas de vista previa.</p>
          )}
        </div>
      ) : null}

      {state.summary ? (
        <div className={`notice ${state.success ? "notice-success" : "notice-error"}`}>{state.summary}</div>
      ) : null}

      {state.errors?.length ? (
        <div className="card subtle-card">
          <h4>Filas con error</h4>
          <ul className="error-list">
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
