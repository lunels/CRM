"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Dashboard" },
  { href: "/customers", label: "Clientes" },
  { href: "/products", label: "Productos" },
  { href: "/orders", label: "Pedidos" }
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link href={href} className={`nav-link${isActive ? " nav-link-active" : ""}`}>
      {label}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">CRM MVP</p>
          <h1>Gestion comercial</h1>
          <p className="muted">Clientes, productos y pedidos con SQLite + Prisma.</p>
        </div>
        <nav className="nav">
          {navigation.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
