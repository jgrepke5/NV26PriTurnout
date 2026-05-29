import { isSubRow } from "@/lib/format";
import { isNumericHeader } from "@/lib/table-headers";
import type { CellValue } from "@/lib/types";
import { RowLabel } from "./RowLabel";
import { TableHeadRow } from "./TableHeadRow";

function isNumericColumn(headers: string[], colIndex: number): boolean {
  return isNumericHeader(headers[colIndex] ?? "", colIndex);
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

function resolveRowClass(
  label: string,
  rowClasses: string[] | undefined,
  ri: number,
): string {
  if (rowClasses?.[ri]) return rowClasses[ri];
  const party = partyRowClass(label);
  const sub = isSubRow(label) ? "row-sub" : "";
  return [party, sub].filter(Boolean).join(" ");
}

export function DataTable({
  headers,
  rows,
  variant = "default",
  rowClasses,
  stickyHeader = false,
}: {
  headers: string[];
  rows: CellValue[][];
  variant?: "default" | "current" | "historical" | "rural";
  rowClasses?: string[];
  stickyHeader?: boolean;
}) {
  const labelCol = 0;

  return (
    <div className={`table-wrap table-wrap--${variant}`}>
      <table className="data-table">
        <TableHeadRow headers={headers} sticky={stickyHeader} />
        <tbody>
          {rows.map((row, ri) => {
            const label = String(row[labelCol] ?? "");
            return (
              <tr key={ri} className={resolveRowClass(label, rowClasses, ri)}>
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
                      {ci === labelCol ? (
                        <RowLabel text={text} />
                      ) : (
                        text
                      )}
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
