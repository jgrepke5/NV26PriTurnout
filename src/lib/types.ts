export type CellValue = string | number | null;

export interface SheetMeta {
  name: string;
  gid: string;
}

export interface SheetTable {
  title: string;
  headers: string[];
  rows: CellValue[][];
  primaryMetricIndex: number | null;
}

export interface TurnoutSnapshot {
  spreadsheetId: string;
  fetchedAt: string;
  sheets: SheetTable[];
  sourceUrl: string;
}
