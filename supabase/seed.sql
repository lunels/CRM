insert into public.clientes (nombre, email, telefono, direccion, ciudad, codigo_postal, pais, notas)
values
  ('Lucia Martin', 'lucia.martin@northwind.es', '+34 600 111 222', 'Calle Serrano 18', 'Madrid', '28001', 'Espana', 'Cliente recurrente'),
  ('Carlos Ruiz', 'carlos@ruizdistribucion.com', '+34 600 333 444', 'Avenida del Puerto 42', 'Valencia', '46023', 'Espana', 'Seguimiento por telefono')
on conflict (email) do nothing;

insert into public.productos (nombre, sku, descripcion, precio, stock, categoria, activo)
values
  ('Licencia CRM Basic', 'CRM-BASIC', 'Suscripcion anual para equipo pequeno', 99.00, 50, 'Software', true),
  ('Pack Soporte Premium', 'SUP-PRO', 'Bolsa de horas de soporte', 250.00, 20, 'Servicios', true)
on conflict (sku) do nothing;
