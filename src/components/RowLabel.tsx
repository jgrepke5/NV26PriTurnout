import { displayLabel } from "@/lib/format";

export function RowLabel({ text }: { text: string }) {
  const trimmed = displayLabel(text);
  const match = trimmed.match(/^Republican\s*\((.+)\)$/i);

  if (!match) return <>{trimmed}</>;

  return (
    <span className="row-label-stack">
      <span className="row-label-main">Republican</span>
      <span className="row-label-note">({match[1]})</span>
    </span>
  );
}
