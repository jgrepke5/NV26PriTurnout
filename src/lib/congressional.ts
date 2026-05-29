import {
  buildBreakoutBlocks,
  type BreakoutTableBlock,
  type BreakoutTableConfig,
} from "./breakout-table";
import type { SheetTable } from "./types";

export type CongressionalTableBlock = BreakoutTableBlock;

const CONGRESSIONAL_CONFIG: BreakoutTableConfig = {
  sheetName: "Congressional",
  labelColumnMatch: (h) => /congressional districts/i.test(h),
  labelHeader: "District",
  isSectionMarker: () => false,
  primaryBlockTitle: "Congressional Districts",
  secondaryBlockTitle: "",
};

export function buildCongressionalBlocks(
  sheet: SheetTable,
): CongressionalTableBlock[] {
  return buildBreakoutBlocks(sheet, CONGRESSIONAL_CONFIG);
}
