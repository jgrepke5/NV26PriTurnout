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
  const res = await fetchWithRetry(
    `${SOURCE_URL.split("/edit")[0]}/htmlview`,
    "sheet index",
  );

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

async function fetchWithRetry(
  url: string,
  label: string,
  attempts = 3,
): Promise<Response> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (res.ok) return res;
      lastError = new Error(`Failed to fetch ${label} (${res.status})`);
    } catch (err) {
      lastError = err;
    }
    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error(`Failed to fetch ${label}`);
}

async function fetchSheetGviz(gid: string, range?: string): Promise<string> {
  const rangeParam = range ? `&range=${encodeURIComponent(range)}` : "";
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${gid}${rangeParam}`;
  const res = await fetchWithRetry(url, `sheet gid=${gid}`);
  return res.text();
}

function isTurnoutComparisonSheet(name: string): boolean {
  return name.trim().toLowerCase() === "turnout comparison by state";
}

async function fetchSheetTable({ name, gid }: SheetMeta) {
  if (isTurnoutComparisonSheet(name)) {
    const raw = await fetchSheetGviz(gid, COMPARISON_RANGE);
    return parseTurnoutComparisonGviz(raw);
  }
  const raw = await fetchSheetGviz(gid);
  const { headers, formatted } = parseGvizJson(raw);
  return toSheetTable(name, headers, formatted);
}

export async function fetchTurnoutSnapshot(): Promise<TurnoutSnapshot> {
  const meta = await discoverSheets();
  const sheets = [];
  for (const tab of meta) {
    sheets.push(await fetchSheetTable(tab));
  }

  return {
    spreadsheetId: SPREADSHEET_ID,
    fetchedAt: new Date().toISOString(),
    sheets,
    sourceUrl: SOURCE_URL,
  };
}
