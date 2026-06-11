const COMPARISON_STATE_HEADERS = new Set([
  "Georgia",
  "Idaho",
  "Indiana",
  "Kentucky",
  "Nebraska",
  "Pennsylvania",
]);

export function isComparisonStateHeader(label: string): boolean {
  return COMPARISON_STATE_HEADERS.has(label.trim());
}

/** Column header text split across up to three lines for narrow columns */
export function headerLines(label: string): string[] {
  const known: Record<string, string[]> = {
    County: ["County"],
    District: ["District"],
    "Party Affiliation": ["Party", "Affiliation"],
    "2026 VR": ["2026", "VR"],
    "Early Voted": ["Early", "Voted"],
    "Mail Voted": ["Mail", "Voted"],
    "E-Day Voted": ["E-Day", "Voted"],
    "Total Votes": ["Total", "Votes"],
    "Votes to Date": ["Votes to", "Date"],
    "% Early Votes": ["% Early", "Votes"],
    "% Mail Votes": ["% Mail", "Votes"],
    "% E-Day Votes": ["% E-Day", "Votes"],
    "Turnout %": ["Turnout", "%"],
    "2026 Turnout %": ["2026", "Turnout %"],
    "2014 Turnout %": ["2014", "Turnout %"],
    "2022 Turnout %": ["2022", "Turnout %"],
    "% to 2014 Turnout": ["% to 2014", "Turnout"],
    "% to 2022 Turnout": ["% to 2022", "Turnout"],
    "National Average Turnout": ["National Average", "Turnout"],
    "NV Turnout % to Date": ["NV Turnout % to Date"],
    "% to Natl Avg": ["% to Natl", "Avg"],
  };

  const lines = known[label];
  if (lines) return lines;

  return [label];
}

export function isNumericHeader(header: string, colIndex: number): boolean {
  if (colIndex === 0) return false;
  return /%|registration|vote|turnout|early|mail|e-day/i.test(header);
}

export type ColumnGroup =
  | "label"
  | "registration"
  | "vote-counts"
  | "total"
  | "vote-pcts"
  | "turnout"
  | "historical-turnout"
  | "comparison";

function resolveColumnGroup(header: string, colIndex: number): ColumnGroup {
  if (colIndex === 0) return "label";

  const h = header.trim();
  if (/^2026 vr$/i.test(h)) return "registration";
  if (/early voted|mail voted|e-day voted/i.test(h)) return "vote-counts";
  if (/total votes|votes to date/i.test(h)) return "total";
  if (/% early votes|% mail votes|% e-day votes/i.test(h)) return "vote-pcts";
  if (/^turnout %$/i.test(h)) return "turnout";
  if (/% to (2014|2022|natl)/i.test(h)) return "comparison";
  if (/2014 turnout %|2022 turnout %/i.test(h)) return "historical-turnout";
  if (/2026 turnout %|nv turnout %/i.test(h)) return "turnout";
  if (/national average turnout/i.test(h)) return "historical-turnout";
  if (/%/.test(h)) return "vote-pcts";
  if (/turnout|to %/i.test(h)) return "turnout";

  return "registration";
}

/** CSS classes for visually grouped table columns */
export function columnGroupClasses(
  header: string,
  colIndex: number,
  headers: string[],
): string {
  const group = resolveColumnGroup(header, colIndex);
  const prevHeader = colIndex > 0 ? (headers[colIndex - 1] ?? "") : "";
  const prevGroup =
    colIndex > 0 ? resolveColumnGroup(prevHeader, colIndex - 1) : null;
  const isGroupStart = colIndex > 0 && group !== prevGroup;

  return [
    `col-group-${group}`,
    isGroupStart ? "col-group-start" : undefined,
  ]
    .filter(Boolean)
    .join(" ");
}
