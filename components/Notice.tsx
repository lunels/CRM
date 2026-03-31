export function Notice({ message, tone = "success" }: { message?: string; tone?: "success" | "error" }) {
  if (!message) {
    return null;
  }

  return <div className={`notice notice-${tone}`}>{message}</div>;
}
