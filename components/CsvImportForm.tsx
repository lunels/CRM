"use client";

import { useActionState } from "react";
import type { ImportState } from "@/lib/actions/customers";

const initialState: ImportState = {
  success: false,
  summary: "",
  errors: []
};

export function CsvImportForm({
  action,
  title,
  description,
  expectedColumns
}: {
  action: (state: ImportState, formData: FormData) => Promise<ImportState>;
  title: string;
  description: string;
  expectedColumns: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

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
          <input className="input" type="file" name="file" accept=".csv,text/csv" required />
        </label>

        <button className="button" type="submit" disabled={pending}>
          {pending ? "Importando..." : "Importar CSV"}
        </button>
      </form>

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
