import {
  buildBreakoutBlocks,
  isMarkerRow,
  type BreakoutTableBlock,
  type BreakoutTableConfig,
} from "./breakout-table";
import type { SheetTable } from "./types";

export type LegislativeTableBlock = BreakoutTableBlock;

const LEGISLATIVE_CONFIG: BreakoutTableConfig = {
  sheetName: "Legislative",
  labelColumnMatch: (h) => /competitive legislative districts/i.test(h),
  labelHeader: "District",
  isSectionMarker: (label, row, layout) =>
    isMarkerRow(label, row, layout, (l) =>
      /non-competitive legislative districts with gop primaries/i.test(l),
    ),
  secondaryBlockTitle: "Non-Competitive District Breakdown",
};

export function buildLegislativeBlocks(
  sheet: SheetTable,
): LegislativeTableBlock[] {
  return buildBreakoutBlocks(sheet, LEGISLATIVE_CONFIG);
}
