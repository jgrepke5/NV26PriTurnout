import { displayLabel } from "./format";
import type { CellValue } from "./types";

export type PieSlice = {
  label: string;
  value: number;
  color: string;
};

export const PARTY_CHART_COLORS = {
  republican: "#c94a4a",
  democrat: "#3d5a9e",
  nonpartisan: "#6b5b8a",
} as const;

export const COUNTY_CHART_COLORS = {
  clark: "#1e4d6b",
  washoe: "#6b4a1e",
  rurals: "#3d6b3d",
} as const;

export function parseVoteCount(cell: CellValue): number {
  if (cell == null || cell === "") return 0;
  const n = Number(String(cell).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

export function votesColumnIndex(
  headers: string[],
  pattern = /votes to date|total votes/i,
): number {
  return headers.findIndex((h) => pattern.test(h));
}

function partyKey(label: string): keyof typeof PARTY_CHART_COLORS | null {
  const t = displayLabel(label).toLowerCase();
  if (t.startsWith("republican")) return "republican";
  if (t.startsWith("democrat")) return "democrat";
  if (t.includes("non-partisan") || t.includes("3rd party")) {
    return "nonpartisan";
  }
  return null;
}

function partyDisplayLabel(key: keyof typeof PARTY_CHART_COLORS): string {
  if (key === "nonpartisan") return "Non-Partisan / 3rd Party";
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function partySlicesFromRows(
  headers: string[],
  rows: CellValue[][],
): PieSlice[] {
  const votesIdx = votesColumnIndex(headers);
  if (votesIdx < 0) return [];

  const slices: PieSlice[] = [];
  for (const row of rows) {
    const key = partyKey(String(row[0] ?? ""));
    if (!key) continue;
    const value = parseVoteCount(row[votesIdx]);
    if (value <= 0) continue;
    slices.push({
      label: partyDisplayLabel(key),
      value,
      color: PARTY_CHART_COLORS[key],
    });
  }
  return slices;
}

export function countyTotalRegionSlices(
  headers: string[],
  peerRows: { name: string; headerRow: CellValue[] }[],
  regionNames: string[],
): PieSlice[] {
  const votesIdx = votesColumnIndex(headers);
  if (votesIdx < 0) return [];

  const slices: PieSlice[] = [];
  for (const region of regionNames) {
    const peer = peerRows.find(
      (p) => p.name.toLowerCase() === region.toLowerCase(),
    );
    if (!peer) continue;
    const value = parseVoteCount(peer.headerRow[votesIdx]);
    if (value <= 0) continue;
    const colorKey = region.toLowerCase() as keyof typeof COUNTY_CHART_COLORS;
    slices.push({
      label: region,
      value,
      color: COUNTY_CHART_COLORS[colorKey] ?? "#888",
    });
  }
  return slices;
}
