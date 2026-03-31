import { PrismaClient, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();

  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        firstName: "Lucia",
        lastName: "Martin",
        email: "lucia.martin@northwind.es",
        phone: "+34 600 111 222",
        address: "Calle Serrano 18",
        city: "Madrid",
        postalCode: "28001",
        country: "Espana",
        notes: "Cliente recurrente de pedidos mensuales."
      }
    }),
    prisma.customer.create({
      data: {
        firstName: "Carlos",
        lastName: "Ruiz",
        company: "Ruiz Distribucion",
        email: "carlos@ruizdistribucion.com",
        phone: "+34 600 333 444",
        address: "Avenida del Puerto 42",
        city: "Valencia",
        postalCode: "46023",
        country: "Espana",
        notes: "Solicita seguimiento por telefono."
      }
    }),
    prisma.customer.create({
      data: {
        firstName: "Ana",
        lastName: "Santos",
        email: "ana.santos@demo.io",
        phone: "+34 600 555 666",
        city: "Barcelona",
        country: "Espana"
      }
    })
  ]);

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Licencia CRM Basic",
        sku: "CRM-BASIC",
        description: "Suscripcion anual para equipo pequeno.",
        price: "99.00",
        stock: 50,
        category: "Software",
        isActive: true
      }
    }),
    prisma.product.create({
      data: {
        name: "Pack Soporte Premium",
        sku: "SUP-PRO",
        description: "Bolsa de horas de soporte y consultoria.",
        price: "250.00",
        stock: 20,
        category: "Servicios",
        isActive: true
      }
    }),
    prisma.product.create({
      data: {
        name: "Terminal Inventario",
        sku: "HW-INV-01",
        description: "Dispositivo para almacenes y logistica.",
        price: "449.00",
        stock: 8,
        category: "Hardware",
        isActive: true
      }
    })
  ]);

  await prisma.order.create({
    data: {
      orderNumber: "PED-2026-001",
      customerId: customers[0].id,
      date: new Date(),
      status: OrderStatus.CONFIRMED,
      subtotal: "349.00",
      tax: "73.29",
      total: "422.29",
      notes: "Entrega prioritaria.",
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            unitPrice: "99.00",
            lineTotal: "99.00"
          },
          {
            productId: products[1].id,
            quantity: 1,
            unitPrice: "250.00",
            lineTotal: "250.00"
          }
        ]
      }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
