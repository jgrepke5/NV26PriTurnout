import { displayLabel } from "./format";
import {
  buildBreakoutBlocks,
  isMarkerRow,
  type BreakoutGroup,
  type BreakoutSection,
  type BreakoutTableBlock,
  type BreakoutTableConfig,
} from "./breakout-table";
import type { CellValue, SheetTable } from "./types";

export type LegislativeTableBlock = BreakoutTableBlock;

const EXCLUDED_SECONDARY_DISTRICTS = new Set(["AD3", "AD5", "AD8"]);

function parseDistrictLabel(fullName: string): {
  district: string;
  parenthetical: string | null;
} {
  const match = fullName.match(/^([A-Z]{2}\d+)\s*\(([^)]+)\)\s*$/i);
  if (!match) return { district: fullName, parenthetical: null };
  return {
    district: match[1].toUpperCase(),
    parenthetical: formatParenthetical(match[2]),
  };
}

function formatParenthetical(text: string): string {
  if (/dem primary only/i.test(text.trim())) return "No Primary";
  return text.trim();
}

function transformLegislativeGroup(group: BreakoutGroup): BreakoutGroup {
  const { district, parenthetical } = parseDistrictLabel(group.name);

  const headerRow: CellValue[] = [...group.headerRow];
  headerRow[0] = district;

  const partyRows = group.partyRows.map((row) => {
    const label = displayLabel(String(row[0] ?? ""));
    if (!parenthetical || !label.toLowerCase().startsWith("republican")) {
      return row;
    }
    const updated: CellValue[] = [...row];
    updated[0] = `Republican (${parenthetical})`;
    return updated;
  });

  return { name: district, headerRow, partyRows };
}

function filterLegislativeGroup(
  group: BreakoutGroup,
  section: BreakoutSection,
): boolean {
  if (section !== "secondary") return true;
  const { district } = parseDistrictLabel(group.name);
  return !EXCLUDED_SECONDARY_DISTRICTS.has(district.toUpperCase());
}

const LEGISLATIVE_CONFIG: BreakoutTableConfig = {
  sheetName: "Legislative",
  labelColumnMatch: (h) => /competitive legislative districts/i.test(h),
  labelHeader: "District",
  isSectionMarker: (label, row, layout) =>
    isMarkerRow(label, row, layout, (l) =>
      /non-competitive legislative districts with gop primaries/i.test(l),
    ),
  secondaryBlockTitle:
    "Districts Where Primary will Likely Determine Final Outcome",
  filterGroup: filterLegislativeGroup,
  transformGroup: transformLegislativeGroup,
};

export function buildLegislativeBlocks(
  sheet: SheetTable,
): LegislativeTableBlock[] {
  return buildBreakoutBlocks(sheet, LEGISLATIVE_CONFIG);
}
