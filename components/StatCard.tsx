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
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {help ? <span className="stat-help">{help}</span> : null}
    </div>
  );
}
