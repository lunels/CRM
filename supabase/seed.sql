insert into public.clientes (nombre, email, telefono, direccion, ciudad, codigo_postal, pais, notas)
values
  ('Lucia Martin', 'lucia.martin@northwind.es', '+34 600 111 222', 'Calle Serrano 18', 'Madrid', '28001', 'Espana', 'Cliente recurrente'),
  ('Carlos Ruiz', 'carlos@ruizdistribucion.com', '+34 600 333 444', 'Avenida del Puerto 42', 'Valencia', '46023', 'Espana', 'Seguimiento por telefono')
on conflict (email) do nothing;

insert into public.productos (proveedor, referencia, descripcion, familia, precio, estado, origen_familia, observaciones)
values
  ('ENPA', 'ENPA-CRM-BASIC', 'Licencia CRM Basic para punto de venta y seguimiento comercial', 'Software comercial', 99.00, 'Activo', 'Catalogo ENPA', 'Producto semilla para demos'),
  ('ENPA', 'ENPA-SUP-PRO', 'Pack de soporte premium para acompanamiento y puesta en marcha', 'Servicios', 250.00, 'Activo', 'Catalogo ENPA', 'Incluye acompanamiento inicial')
on conflict (referencia) do nothing;
