# CRM Web MVP con Supabase

CRM web sencillo y funcional, preparado para desplegarse en Vercel y usar Supabase como backend serverless. Mantiene dashboard, CRUD de clientes, productos y pedidos, junto con importacion CSV para clientes y productos.

## Stack

- Next.js 15 con App Router
- TypeScript
- Supabase (`@supabase/supabase-js`)
- PostgreSQL gestionado por Supabase
- React 19
- Server Actions ligeras compatibles con Vercel

## Que hace este proyecto

- Dashboard con resumen de clientes, productos y pedidos
- CRUD de clientes
- CRUD de productos
- CRUD de pedidos con lineas
- Cambio de estado de pedidos
- Busqueda y ordenacion basica
- Importacion CSV con validacion previa
- UI responsive y simple

## Estructura

```text
crm-web/
├── app/
├── components/
├── lib/
│   ├── actions/
│   ├── csv.ts
│   ├── data.ts
│   ├── supabase.ts
│   ├── types.ts
│   ├── utils.ts
│   └── validation.ts
├── supabase/
│   └── schema.sql
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Variables de entorno

Crea un archivo `.env.local` a partir de `.env.example`:

```bash
cp .env.example .env.local
```

Contenido esperado:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Crear el proyecto en Supabase

1. Crea un proyecto nuevo en [Supabase](https://supabase.com/).
2. Espera a que termine el aprovisionamiento.
3. Ve a `Project Settings > API`.
4. Copia:
   - `Project URL` en `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` en `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Crear el esquema de base de datos

Dentro de Supabase:

1. Abre `SQL Editor`.
2. Crea una nueva query.
3. Copia el contenido de `supabase/schema.sql`.
4. Ejecuta la query.

Ese script crea:

- tablas `clientes`, `productos`, `pedidos`, `pedido_lineas`
- claves foraneas
- indices
- restricciones unicas
- politicas RLS abiertas para MVP

Importante: las politicas incluidas facilitan el arranque con la `anon key`. Para un entorno real conviene endurecerlas y anadir autenticacion.

## Instalacion local

1. Entra en la carpeta:

```bash
cd crm-web
```

2. Instala dependencias:

```bash
npm install
```

3. Crea `.env.local` y pega tus credenciales de Supabase.

4. Arranca el entorno local:

```bash
npm run dev
```

La aplicacion quedara en:

```text
http://localhost:3000
```

## Build de produccion

Para verificar compatibilidad con Vercel:

```bash
npm run build
```

## Despliegue en Vercel

1. Sube este proyecto a GitHub.
2. Crea un proyecto en [Vercel](https://vercel.com/).
3. Importa el repositorio.
4. En `Environment Variables`, configura:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Lanza el despliegue.

No se usa almacenamiento local persistente ni SQLite, por lo que el proyecto es compatible con entorno serverless.

## Modelo de datos en Supabase

### `clientes`

- `id`
- `nombre`
- `email`
- `telefono`
- `direccion`
- `ciudad`
- `codigo_postal`
- `pais`
- `notas`
- `created_at`

### `productos`

- `id`
- `proveedor`
- `referencia`
- `descripcion`
- `familia`
- `precio`
- `estado`
- `origen_familia`
- `observaciones`
- `created_at`

### `pedidos`

- `id`
- `numero`
- `cliente_id`
- `fecha`
- `estado`
- `subtotal`
- `impuestos`
- `total`
- `notas`
- `created_at`

### `pedido_lineas`

- `id`
- `pedido_id`
- `producto_id`
- `cantidad`
- `precio_unitario`
- `total`

## Importacion CSV

Pantallas disponibles:

- `/customers/import`
- `/products/import`

### Formato CSV de clientes

```csv
nombre,email,telefono,direccion,ciudad,codigo_postal,pais,notas
Lucia,lucia@empresa.com,+34600111222,Calle Mayor 1,Madrid,28001,Espana,Cliente VIP
```

### Formato CSV de productos

```csv
proveedor,referencia,descripcion,familia,precio,estado,origen_familia,observaciones
ENPA,REF-001,Descripcion,Iluminacion,99.90,Activo,Catalogo ENPA,Producto destacado
```

Comportamiento:

- valida filas antes de insertar
- usa `upsert` en batch con Supabase
- actualiza por `email` en clientes
- actualiza por `referencia` en productos
- muestra resumen y errores

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Git y GitHub

### Revisar estado

```bash
cd crm-web
git status
```

### Crear repo remoto con GitHub CLI

```bash
gh repo create crm-web --private --source=. --remote=origin
```

### O conectar un remoto existente

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
```

### Subir a `main`

```bash
git push -u origin main
```

## Notas tecnicas

- La capa de datos ya no depende de Prisma ni SQLite
- Las operaciones CRUD usan `@supabase/supabase-js`
- El proyecto no necesita backend tradicional
- Las Server Actions actuan como capa ligera compatible con Vercel
- La autenticacion con Supabase Auth no se ha activado para mantener el MVP simple
