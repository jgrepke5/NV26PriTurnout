export function formatFetchedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function isSubRow(label: string): boolean {
  return /^\s{2,}/.test(label) || label.startsWith("    ");
}

export function displayLabel(label: string): string {
  return label.trim();
}
