"use client";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="page-stack">
      <section className="card form-stack">
        <div>
          <p className="eyebrow">Configuracion pendiente</p>
          <h2>La aplicacion no ha podido cargar los datos</h2>
        </div>

        <p className="muted">
          Este despliegue suele fallar cuando faltan variables de entorno de Supabase o cuando el esquema SQL no
          se ha creado todavia en la base de datos.
        </p>

        <div className="notice notice-error">
          <strong>Revisa primero:</strong>
          <p>`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en Vercel.</p>
          <p>Que hayas ejecutado `supabase/schema.sql` dentro del SQL Editor de Supabase.</p>
          <p>Que las tablas `clientes`, `productos`, `pedidos` y `pedido_lineas` existan.</p>
        </div>

        {error.message ? (
          <div className="card subtle-card">
            <h3>Detalle tecnico</h3>
            <p className="muted">{error.message}</p>
            {error.digest ? <p className="muted">Digest: {error.digest}</p> : null}
          </div>
        ) : null}

        <div className="form-actions">
          <button className="button" type="button" onClick={() => reset()}>
            Reintentar
          </button>
        </div>
      </section>
    </div>
  );
}
