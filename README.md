# CRM Web MVP

Aplicacion web tipo CRM, sencilla pero funcional, construida con Next.js, TypeScript, Prisma y SQLite. Incluye gestion de clientes, productos y pedidos, dashboard inicial e importacion CSV para clientes y productos.

## Stack

- Next.js 15 con App Router
- TypeScript
- Prisma ORM
- SQLite
- React 19
- Server Actions para operaciones CRUD

## Funcionalidades incluidas

- Dashboard con resumen de clientes, productos y pedidos
- CRUD de clientes
- CRUD de productos
- CRUD de pedidos con lineas de pedido
- Cambio de estado de pedidos
- Busqueda y ordenacion basica
- Importacion CSV de clientes y productos
- Mensajes de exito y error
- Seed opcional con datos de ejemplo
- Estilos responsive y estructura modular

## Estructura del proyecto

```text
crm-web/
├── app/
├── components/
├── lib/
│   ├── actions/
│   ├── csv.ts
│   ├── prisma.ts
│   ├── utils.ts
│   └── validation.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Requisitos previos

- Node.js 20 o superior
- npm 10 o superior

Comprueba versiones:

```bash
node -v
npm -v
```

## Instalacion local

1. Entrar en la carpeta del proyecto:

```bash
cd crm-web
```

2. Crear el archivo de entorno:

```bash
cp .env.example .env
```

3. Instalar dependencias:

```bash
npm install
```

4. Generar el cliente Prisma:

```bash
npm run prisma:generate
```

5. Crear la base de datos SQLite y sincronizar esquema:

```bash
npm run prisma:push
```

6. Cargar datos de ejemplo opcionales:

```bash
npm run seed
```

7. Arrancar el entorno de desarrollo:

```bash
npm run dev
```

La aplicacion quedara disponible en:

```text
http://localhost:3000
```

## Scripts utiles

- `npm run dev`: desarrollo local
- `npm run build`: build de produccion
- `npm run start`: arranque en produccion
- `npm run prisma:generate`: generar cliente Prisma
- `npm run prisma:push`: aplicar esquema a SQLite
- `npm run prisma:migrate`: crear migraciones en desarrollo
- `npm run prisma:studio`: abrir Prisma Studio
- `npm run seed`: cargar datos de ejemplo

## Base de datos

El proyecto usa SQLite para simplificar el arranque local.

- Archivo configurado mediante `DATABASE_URL`
- Valor por defecto en `.env.example`: `file:./dev.db`

## Entidades principales

### Clientes

Campos principales:

- `id`
- `firstName`
- `lastName`
- `company`
- `email`
- `phone`
- `address`
- `city`
- `postalCode`
- `country`
- `notes`
- `createdAt`

### Productos

Campos principales:

- `id`
- `name`
- `sku`
- `description`
- `price`
- `stock`
- `category`
- `isActive`
- `createdAt`

### Pedidos

Campos principales:

- `id`
- `orderNumber`
- `customerId`
- `date`
- `status`
- `subtotal`
- `tax`
- `total`
- `notes`

Cada pedido incluye lineas con:

- `productId`
- `quantity`
- `unitPrice`
- `lineTotal`

## Importacion CSV

Hay pantallas especificas para importar clientes y productos:

- `/customers/import`
- `/products/import`

### CSV de clientes

Formato recomendado:

```csv
nombre,email,telefono,direccion,ciudad,codigo_postal,pais,notas
Lucia,lucia@empresa.com,+34600111222,Calle Mayor 1,Madrid,28001,Espana,Cliente VIP
```

Comportamiento:

- valida campos minimos
- muestra resumen de importacion
- indica filas con error
- si el email ya existe, actualiza el cliente

### CSV de productos

Formato recomendado:

```csv
nombre,sku,descripcion,precio,stock,categoria,activo
Producto demo,SKU-001,Descripcion,99.90,12,Software,true
```

Comportamiento:

- valida campos minimos
- muestra resumen de importacion
- indica filas con error
- si el SKU ya existe, actualiza el producto

## Despliegue

Para un despliegue sencillo en Vercel:

1. Configura la variable `DATABASE_URL`
2. Ejecuta build:

```bash
npm run build
```

3. Arranca en produccion:

```bash
npm run start
```

Nota: para produccion real conviene migrar de SQLite a PostgreSQL o MySQL.

## Git y GitHub

El proyecto queda preparado para trabajar con Git y subirlo a GitHub facilmente.

### Inicializar y revisar estado

```bash
cd crm-web
git status
```

### Crear un repositorio remoto nuevo en GitHub

Con GitHub CLI:

```bash
gh repo create crm-web --private --source=. --remote=origin
```

### O conectar un repositorio remoto existente

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
```

### Renombrar rama principal a `main`

```bash
git branch -M main
```

### Subir el proyecto por primera vez

```bash
git push -u origin main
```

## Primer commit

El commit inicial solicitado es:

```text
Initial CRM setup
```

## Notas tecnicas

- No incluye autenticacion para mantener el MVP simple
- El backend esta integrado en Next.js mediante Server Actions
- La UI prioriza claridad, mantenimiento y rapidez de arranque
- El proyecto esta preparado para crecer con modulos adicionales
