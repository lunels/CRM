export function formatCurrency(value: number | string) {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR"
  }).format(Number.isNaN(amount) ? 0 : amount);
}

export function formatDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium"
  }).format(date);
}

export function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getDisplayName(customer: {
  firstName: string;
  lastName?: string | null;
  company?: string | null;
}) {
  const fullName = [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim();
  return customer.company?.trim() || fullName || customer.firstName;
}
