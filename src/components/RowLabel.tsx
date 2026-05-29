import { displayLabel } from "@/lib/format";

const NONPARTISAN_LABEL = /^non-partisan\s*\/\s*3rd\s*party$/i;
const PARTY_PRIMARY_LABEL = /^(Democrat|Republican)\s*\((.+)\)$/i;

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

  const partyMatch = trimmed.match(PARTY_PRIMARY_LABEL);
  if (partyMatch) {
    return (
      <span className="row-label-stack">
        <span className="row-label-main">{partyMatch[1]}</span>
        <span className="row-label-note">({partyMatch[2]})</span>
      </span>
    );
  }

  return <>{trimmed}</>;
}
