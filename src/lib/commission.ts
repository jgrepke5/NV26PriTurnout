import {
  buildBreakoutBlocks,
  isMarkerRow,
  type BreakoutTableBlock,
  type BreakoutTableConfig,
} from "./breakout-table";
import type { SheetTable } from "./types";

export type CommissionTableBlock = BreakoutTableBlock;

const COMMISSION_CONFIG: BreakoutTableConfig = {
  sheetName: "Commission",
  labelColumnMatch: (h) => /washoe/i.test(h),
  labelHeader: "District",
  isSectionMarker: (label, row, layout) =>
    isMarkerRow(label, row, layout, (l) => l.toUpperCase() === "CLARK"),
  primaryBlockTitle: "Washoe County Commission",
  secondaryBlockTitle: "Clark County Commission",
};

export function buildCommissionBlocks(
  sheet: SheetTable,
): CommissionTableBlock[] {
  return buildBreakoutBlocks(sheet, COMMISSION_CONFIG);
}
