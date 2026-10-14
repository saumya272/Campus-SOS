// A coloured label that always includes the status as text (never colour alone).
export default function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${status.toLowerCase()}`}>
      <span className="badge-dot" aria-hidden="true" />
      {status}
    </span>
  );
}
