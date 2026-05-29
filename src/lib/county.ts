import { displayLabel } from "./format";
import type { CellValue, SheetTable } from "./types";

export interface CountyTableBlock {
  title?: string;
  headers: string[];
  rows: CellValue[][];
  rowClasses: string[];
  variant: "current" | "rural";
}

type ColumnSpec = {
  match: (header: string) => boolean;
  label: string;
};

const DATA_COLUMNS: ColumnSpec[] = [
  {
    match: (h) => /'26\s*vr/i.test(h),
    label: "2026 Active Voter Registration",
  },
  { match: (h) => /early voted/i.test(h), label: "Early Voted" },
  { match: (h) => /mail voted/i.test(h), label: "Mail Voted" },
  { match: (h) => /total votes/i.test(h), label: "Total Votes" },
  { match: (h) => /% early votes/i.test(h), label: "% Early Votes" },
  { match: (h) => /% mail votes/i.test(h), label: "% Mail Votes" },
  { match: (h) => /turnout %/i.test(h), label: "Turnout %" },
];

interface CountyLayout {
  labelIndex: number;
  dataIndices: number[];
  headers: string[];
}

interface CountyGroup {
  name: string;
  countyRow: CellValue[];
  partyRows: CellValue[][];
}

function resolveLayout(sheet: SheetTable): CountyLayout {
  const labelIndex = sheet.headers.findIndex((h) =>
    /turnout by county/i.test(h),
  );
  if (labelIndex < 0) {
    throw new Error("Missing county label column on County sheet");
  }

  const dataIndices = DATA_COLUMNS.map((spec) => {
    const idx = sheet.headers.findIndex((h) => spec.match(h));
    if (idx < 0) {
      throw new Error(`Missing expected column on County sheet: ${spec.label}`);
    }
    return idx;
  });

  return {
    labelIndex,
    dataIndices,
    headers: ["County", ...DATA_COLUMNS.map((s) => s.label)],
  };
}

function projectRow(row: CellValue[], layout: CountyLayout): CellValue[] {
  return [row[layout.labelIndex] ?? null, ...layout.dataIndices.map((i) => row[i] ?? null)];
}

function rowLabel(row: CellValue[], layout: CountyLayout): string {
  return String(row[layout.labelIndex] ?? "");
}

function isPartyRow(label: string): boolean {
  if (/^\s{2,}/.test(label)) return true;
  const t = displayLabel(label).toLowerCase();
  return (
    t.startsWith("democrat") ||
    t.startsWith("republican") ||
    t.includes("non-partisan") ||
    t.includes("3rd party")
  );
}

function isRuralSectionMarker(row: CellValue[], layout: CountyLayout): boolean {
  const label = displayLabel(rowLabel(row, layout));
  if (label.toUpperCase() !== "RURALS") return false;
  const projected = projectRow(row, layout);
  return projected.slice(1).every((c) => c == null || c === "");
}

function partyRowClass(label: string): string {
  const party = displayLabel(label).toLowerCase();
  if (party.startsWith("republican")) return "row-republican";
  if (party.startsWith("democrat")) return "row-democrat";
  if (party.includes("non-partisan") || party.includes("3rd party")) {
    return "row-nonpartisan";
  }
  return "";
}

function readGroup(
  rows: CellValue[][],
  start: number,
  layout: CountyLayout,
): { group: CountyGroup; next: number } | null {
  if (start >= rows.length) return null;

  const rawLabel = rowLabel(rows[start], layout);
  const name = displayLabel(rawLabel);
  if (!name || isPartyRow(rawLabel)) return null;

  const countyRow = projectRow(rows[start], layout);
  let i = start + 1;
  const partyRows: CellValue[][] = [];

  while (i < rows.length) {
    const nextLabel = rowLabel(rows[i], layout);
    if (!isPartyRow(nextLabel)) break;
    partyRows.push(projectRow(rows[i], layout));
    i++;
  }

  return { group: { name, countyRow, partyRows }, next: i };
}

function parseSection(
  rows: CellValue[][],
  start: number,
  end: number,
  layout: CountyLayout,
): CountyGroup[] {
  const groups: CountyGroup[] = [];
  let i = start;

  while (i < end) {
    if (isRuralSectionMarker(rows[i], layout)) {
      i++;
      continue;
    }

    const parsed = readGroup(rows, i, layout);
    if (!parsed) {
      i++;
      continue;
    }

    groups.push(parsed.group);
    i = parsed.next;
  }

  return groups;
}

function splitSheetRows(
  rows: CellValue[][],
  layout: CountyLayout,
): { summary: CountyGroup[]; rural: CountyGroup[] } {
  const markerIdx = rows.findIndex((row) => isRuralSectionMarker(row, layout));
  const summaryEnd = markerIdx >= 0 ? markerIdx : rows.length;
  const summary = parseSection(rows, 0, summaryEnd, layout);
  const ruralStart = markerIdx >= 0 ? markerIdx + 1 : rows.length;
  const rural = parseSection(rows, ruralStart, rows.length, layout);
  return { summary, rural };
}

function flattenGroup(group: CountyGroup): {
  rows: CellValue[][];
  rowClasses: string[];
} {
  const rows: CellValue[][] = [];
  const rowClasses: string[] = [];
  const isTotal = group.name.toLowerCase() === "total";

  rows.push(group.countyRow);
  rowClasses.push(
    isTotal ? "row-county-header row-total" : "row-county-header",
  );

  for (const partyRow of group.partyRows) {
    rows.push(partyRow);
    const partyClass = partyRowClass(String(partyRow[0] ?? ""));
    rowClasses.push(["row-sub", partyClass].filter(Boolean).join(" "));
  }

  return { rows, rowClasses };
}

function buildBlock(
  groups: CountyGroup[],
  headers: string[],
  variant: CountyTableBlock["variant"],
  title?: string,
): CountyTableBlock {
  const rows: CellValue[][] = [];
  const rowClasses: string[] = [];

  for (const group of groups) {
    const flat = flattenGroup(group);
    rows.push(...flat.rows);
    rowClasses.push(...flat.rowClasses);
  }

  return { title, headers, rows, rowClasses, variant };
}

export function buildCountyBlocks(sheet: SheetTable): CountyTableBlock[] {
  const layout = resolveLayout(sheet);
  const { summary, rural } = splitSheetRows(sheet.rows, layout);

  return [
    buildBlock(summary, layout.headers, "current"),
    buildBlock(rural, layout.headers, "rural", "Rural County Breakdown"),
  ];
}
