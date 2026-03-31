export function StatCard({
  label,
  value,
  help
}: {
  label: string;
  value: string | number;
  help?: string;
}) {
  return (
    <div className="card stat-card">
      <p className="muted">{label}</p>
      <strong>{value}</strong>
      {help ? <span className="muted">{help}</span> : null}
    </div>
  );
}
