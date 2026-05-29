import type { TableBlock } from "./statewide";
import type { CellValue, SheetTable } from "./types";

/** Sheet rows 11–14: second-table turnout comparison by state */
const SECOND_TABLE_START = 10;
const SECOND_TABLE_ROW_COUNT = 4;

function stateNameFromHeader(header: string): string | null {
  const trimmed = header.trim();
  if (!trimmed || /state\s*republican/i.test(trimmed)) return null;
  const match = trimmed.match(/^([A-Za-z]+)/);
  if (!match || match[1] === "State") return null;
  return match[1];
}

function selectSecondTableRows(rows: CellValue[][]): CellValue[][] {
  if (rows.length <= SECOND_TABLE_ROW_COUNT) {
    return rows;
  }
  const startIdx = rows.findIndex((row) => {
    const label = String(row[0] ?? "").trim();
    return /statewide\s*to/i.test(label);
  });
  const sliceStart = startIdx >= 0 ? startIdx : SECOND_TABLE_START;
  return rows.slice(sliceStart, sliceStart + SECOND_TABLE_ROW_COUNT);
}

export function buildNationwideComparisonBlock(
  sheet: SheetTable,
): TableBlock | null {
  const dataRows = selectSecondTableRows(sheet.rows);
  if (dataRows.length === 0) return null;

  const stateHeaders = sheet.headers
    .slice(1)
    .map(stateNameFromHeader)
    .filter((h): h is string => h != null);

  if (stateHeaders.length === 0) return null;

  const headers = ["Category", ...stateHeaders];
  const rows = dataRows.map((row) => [
    row[0] ?? null,
    ...stateHeaders.map((_, i) => row[i + 1] ?? null),
  ]);

  return {
    title: "Nationwide Comparison",
    headers,
    rows,
    variant: "historical",
  };
}
