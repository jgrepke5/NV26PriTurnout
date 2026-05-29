import { displayLabel } from "@/lib/format";

const NONPARTISAN_LABEL = /^non-partisan\s*\/\s*3rd\s*party$/i;

export function RowLabel({ text }: { text: string }) {
  const trimmed = displayLabel(text);

  if (NONPARTISAN_LABEL.test(trimmed)) {
    return (
      <span className="row-label-np-split">
        <span className="row-label-np-line1">Non-Partisan /</span>
        <span className="row-label-np-line2">3rd Party</span>
      </span>
    );
  }

  const match = trimmed.match(/^Republican\s*\((.+)\)$/i);

  if (!match) return <>{trimmed}</>;

  return (
    <span className="row-label-stack">
      <span className="row-label-main">Republican</span>
      <span className="row-label-note">({match[1]})</span>
    </span>
  );
}
