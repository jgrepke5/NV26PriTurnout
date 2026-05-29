import { displayLabel } from "@/lib/format";
import type { CellValue } from "@/lib/types";

function isNumericColumn(headers: string[], colIndex: number): boolean {
  if (colIndex === 0) return false;
  const h = headers[colIndex] ?? "";
  return /%|registration|vote|turnout|early|mail/i.test(h);
}

function partyRowClass(label: string): string {
  const party = displayLabel(label).toLowerCase();
  if (party === "total") return "row-total";
  if (party.startsWith("republican")) return "row-republican";
  if (party.startsWith("democrat")) return "row-democrat";
  if (party.includes("non-partisan") || party.includes("3rd party")) {
    return "row-nonpartisan";
  }
  return "";
}

export function DataTable({
  headers,
  rows,
  variant = "default",
}: {
  headers: string[];
  rows: CellValue[][];
  variant?: "default" | "current" | "historical";
}) {
  const labelCol = 0;

  return (
    <div className={`table-wrap table-wrap--${variant}`}>
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={`${h}-${i}`}
                className={isNumericColumn(headers, i) ? "num" : undefined}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const label = String(row[labelCol] ?? "");
            return (
              <tr key={ri} className={partyRowClass(label)}>
                {row.map((cell, ci) => {
                  const text =
                    cell == null || cell === "" ? "—" : String(cell);
                  const isNum = isNumericColumn(headers, ci);
                  return (
                    <td
                      key={ci}
                      className={isNum ? "num" : undefined}
                      data-label={headers[ci]}
                    >
                      {ci === labelCol ? displayLabel(text) : text}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
