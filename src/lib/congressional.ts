import type { DataGroup } from "@/lib/breakout-table";
import {
  buildBreakoutBlocks,
  type BreakoutTableBlock,
  type BreakoutTableConfig,
} from "./breakout-table";
import {
  congressionalTotalDistrictSlices,
  parseVoteCount,
  partySlicesFromRows,
} from "./chart-data";
import { displayLabel } from "./format";
import type { CellValue, SheetTable } from "./types";

export type CongressionalTableBlock = BreakoutTableBlock;

const CONGRESSIONAL_DISTRICTS = ["CD1", "CD2", "CD3", "CD4"];

const CONGRESSIONAL_CONFIG: BreakoutTableConfig = {
  sheetName: "Congressional",
  labelColumnMatch: (h) => /congressional districts/i.test(h),
  labelHeader: "District",
  isSectionMarker: () => false,
  primaryBlockTitle: "Congressional Districts",
  secondaryBlockTitle: "",
  buildChartSlices: (group, { allGroups, section, headers }) => {
    if (section === "primary" && group.name.toLowerCase() === "total") {
      return congressionalTotalDistrictSlices(
        headers,
        allGroups,
        CONGRESSIONAL_DISTRICTS,
      );
    }
    return partySlicesFromRows(headers, group.partyRows);
  },
};

function isDistrictGroup(name: string): boolean {
  return /^CD\d+/i.test(displayLabel(name));
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

function sumNumericColumns(rows: CellValue[][], colCount: number): CellValue[] {
  const sums: number[] = Array(colCount).fill(0);
  for (const row of rows) {
    for (let i = 1; i < colCount; i++) {
      sums[i] += parseVoteCount(row[i]);
    }
  }
  return sums.map((n, i) => (i === 0 ? null : n > 0 ? n : null));
}

function appendTotalGroup(block: BreakoutTableBlock): BreakoutTableBlock {
  const districts = block.groups.filter((g) => isDistrictGroup(g.name));
  const hasTotal = block.groups.some((g) => g.name.toLowerCase() === "total");
  if (hasTotal || districts.length === 0) return block;

  const colCount = block.headers.length;
  const headerRows = districts.map((d) => d.rows[0]);
  const headerSums = sumNumericColumns(headerRows, colCount);
  const headerRow: CellValue[] = ["Total", ...headerSums.slice(1)];

  const partyByLabel = new Map<string, CellValue[][]>();
  for (const district of districts) {
    for (const row of district.rows.slice(1)) {
      const label = displayLabel(String(row[0] ?? ""));
      if (!label) continue;
      const existing = partyByLabel.get(label) ?? [];
      existing.push(row);
      partyByLabel.set(label, existing);
    }
  }

  const rows: CellValue[][] = [headerRow];
  const rowClasses = ["row-county-header row-total"];

  for (const [label, partyRows] of partyByLabel) {
    const sums = sumNumericColumns(partyRows, colCount);
    rows.push([label, ...sums.slice(1)]);
    rowClasses.push(
      ["row-sub", partyRowClass(label)].filter(Boolean).join(" "),
    );
  }

  const chartSlices = congressionalTotalDistrictSlices(
    block.headers,
    districts.map((d) => ({ name: d.name, headerRow: d.rows[0] })),
    CONGRESSIONAL_DISTRICTS,
  );

  const totalGroup: DataGroup = {
    name: "Total",
    rows,
    rowClasses,
    chartSlices,
  };

  return { ...block, groups: [...block.groups, totalGroup] };
}

export function buildCongressionalBlocks(
  sheet: SheetTable,
): CongressionalTableBlock[] {
  return buildBreakoutBlocks(sheet, CONGRESSIONAL_CONFIG).map(appendTotalGroup);
}
