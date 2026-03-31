"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body>
        <main style={{ padding: "2rem", background: "#f3efe8", minHeight: "100vh", color: "#1f1b16" }}>
          <section
            style={{
              maxWidth: "780px",
              margin: "0 auto",
              padding: "1.5rem",
              borderRadius: "20px",
              background: "#fffdf9",
              border: "1px solid #ded4c6"
            }}
          >
            <h1>Error de aplicacion</h1>
            <p>
              Este despliegue no ha podido arrancar correctamente. Revisa las variables de entorno de Supabase y
              que el esquema SQL este creado en la base de datos.
            </p>
            {error.message ? <p>Detalle: {error.message}</p> : null}
            {error.digest ? <p>Digest: {error.digest}</p> : null}
            <button
              type="button"
              onClick={() => reset()}
              style={{
                marginTop: "1rem",
                padding: "0.85rem 1.1rem",
                borderRadius: "14px",
                border: 0,
                background: "#1f6f5f",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              Reintentar
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
