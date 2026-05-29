import {
  buildBreakoutBlocks,
  isMarkerRow,
  type BreakoutTableBlock,
  type BreakoutTableConfig,
} from "./breakout-table";
import type { CellValue, SheetTable } from "./types";

export type CountyTableBlock = BreakoutTableBlock;

const COUNTY_CONFIG: BreakoutTableConfig = {
  sheetName: "County",
  labelColumnMatch: (h) => /turnout by county/i.test(h),
  labelHeader: "County",
  isSectionMarker: (label, row, layout) =>
    isMarkerRow(label, row, layout, (l) => l.toUpperCase() === "RURALS"),
  secondaryBlockTitle: "Rural County Breakdown",
};

export function buildCountyBlocks(sheet: SheetTable): CountyTableBlock[] {
  return buildBreakoutBlocks(sheet, COUNTY_CONFIG);
}
