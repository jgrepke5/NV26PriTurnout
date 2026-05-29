import { parseGvizJson, toSheetTable } from "./parse";
import {
  COMPARISON_RANGE,
  parseTurnoutComparisonGviz,
} from "./turnout-comparison";
import type { SheetMeta, TurnoutSnapshot } from "./types";

const SPREADSHEET_ID =
  process.env.GOOGLE_SHEETS_ID ?? "1vxtJSRNtDA6d8IG1UB-XDUuwKJOrk8xtDXazYEoLwG4";

const SOURCE_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;

export async function discoverSheets(): Promise<SheetMeta[]> {
  const res = await fetch(`${SOURCE_URL.split("/edit")[0]}/htmlview`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Failed to load sheet index (${res.status})`);

  const html = await res.text();
  const pattern =
    /items\.push\(\{name:\s*"([^"]+)",\s*pageUrl:[^,]+,\s*gid:\s*"([^"]+)"/g;
  const sheets: SheetMeta[] = [];
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(html)) !== null) {
    sheets.push({ name: m[1], gid: m[2] });
  }

  if (sheets.length === 0) {
    throw new Error("Could not discover worksheet tabs from spreadsheet");
  }

  return sheets.filter((s) => s.name.trim().toLowerCase() !== "data");
}

async function fetchSheetGviz(gid: string, range?: string): Promise<string> {
  const rangeParam = range ? `&range=${encodeURIComponent(range)}` : "";
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${gid}${rangeParam}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Failed to fetch sheet gid=${gid} (${res.status})`);
  return res.text();
}

function isTurnoutComparisonSheet(name: string): boolean {
  return name.trim().toLowerCase() === "turnout comparison by state";
}

export async function fetchTurnoutSnapshot(): Promise<TurnoutSnapshot> {
  const meta = await discoverSheets();
  const sheets = await Promise.all(
    meta.map(async ({ name, gid }) => {
      if (isTurnoutComparisonSheet(name)) {
        const raw = await fetchSheetGviz(gid, COMPARISON_RANGE);
        return parseTurnoutComparisonGviz(raw);
      }
      const raw = await fetchSheetGviz(gid);
      const { headers, formatted } = parseGvizJson(raw);
      return toSheetTable(name, headers, formatted);
    }),
  );

  return {
    spreadsheetId: SPREADSHEET_ID,
    fetchedAt: new Date().toISOString(),
    sheets,
    sourceUrl: SOURCE_URL,
  };
}
