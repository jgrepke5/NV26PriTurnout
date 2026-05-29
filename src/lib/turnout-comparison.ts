import { parseGvizJson } from "./parse";
import type { TableBlock } from "./statewide";
import type { CellValue, SheetTable } from "./types";

/** Second table on the Turnout Comparison tab (sheet rows 10–13). */
const COMPARISON_RANGE = "A10:J14";

export function parseTurnoutComparisonGviz(raw: string): SheetTable {
  const { headers, formatted } = parseGvizJson(raw);

  const cleanHeaders = headers.map((header, i) => {
    if (i === 0 && !header.trim()) return "Party Affiliation";
    return header.trim() || `Column ${i + 1}`;
  });

  const rows: CellValue[][] = formatted
    .map((row) => row.map((cell) => (cell === "" ? null : cell) as CellValue))
    .filter((row) => {
      const label = String(row[0] ?? "").trim();
      return label.length > 0 && !/statewide\s*to/i.test(label);
    });

  return {
    title: "Turnout Comparison by State",
    headers: cleanHeaders,
    rows,
    primaryMetricIndex: null,
  };
}

export const NATIONWIDE_COMPARISON_FOOTNOTE =
  "States used for Nationwide Comparison include only those that report partisan voter registration and have completed their 2026 primary election. Early voting metrics are not included as states have disparate rules governing early voting not necessarily applicable to Nevada or one another.";

function normalizeComparisonHeaders(headers: string[]): string[] {
  return headers.map((header, i) => {
    const trimmed = header.trim();
    if (i === 0 || /^column\s*1$/i.test(trimmed) || trimmed === "Category") {
      return "Party Affiliation";
    }
    return trimmed || header;
  });
}

export function buildNationwideComparisonBlock(
  sheet: SheetTable,
): TableBlock | null {
  if (sheet.rows.length === 0) return null;

  return {
    title: "Nationwide Comparison",
    headers: normalizeComparisonHeaders(sheet.headers),
    rows: sheet.rows,
    variant: "historical",
    wrapHeaders: true,
    footnote: NATIONWIDE_COMPARISON_FOOTNOTE,
  };
}

export { COMPARISON_RANGE };
