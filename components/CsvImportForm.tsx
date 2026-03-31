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
        <h3>{title}</h3>
        <p className="muted">{description}</p>
      </div>

      <div className="code-block">{expectedColumns}</div>

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
          />
        </label>

        <button className="button" type="submit" disabled={pending}>
          {pending ? "Importando..." : "Importar CSV"}
        </button>
      </form>

      {fileName ? (
        <div className={`card subtle-card${tone === "compact" ? " compact-card" : ""}`}>
          <h4>Vista previa</h4>
          <p className="muted">{fileName}</p>
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
