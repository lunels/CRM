import Link from "next/link";

type Action = {
  href: string;
  label: string;
  secondary?: boolean;
  icon?: React.ReactNode;
};

export function PageHeader({
  title,
  description,
  actions
}: {
  title: string;
  description?: string;
  actions?: Action[];
}) {
  return (
    <div className="page-header">
      <div>
        <h2>{title}</h2>
        {description ? <p className="muted" style={{ marginTop: "0.25rem" }}>{description}</p> : null}
      </div>
      {actions?.length ? (
        <div className="page-header-actions">
          {actions.map((action) => (
            <Link
              key={`${action.href}-${action.label}`}
              href={action.href}
              className={action.secondary ? "button button-secondary" : "button"}
            >
              {action.icon}
              {action.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
