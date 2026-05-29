import type { DataGroup } from "@/lib/breakout-table";
import { displayLabel } from "@/lib/format";
import type { CellValue } from "@/lib/types";
import { TurnoutPieChart } from "./TurnoutPieChart";

export type { DataGroup };

export function GroupedDataTable({
  headers,
  groups,
  variant,
}: {
  headers: string[];
  groups: DataGroup[];
  variant?: "default" | "current" | "historical" | "rural";
}) {
  return (
    <div className={`table-wrap table-wrap--${variant ?? "default"} grouped-table`}>
      <table className="data-table grouped-table-head">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={`${h}-${i}`}
                className={
                  i > 0 && /%|registration|vote|turnout|early|mail/i.test(h)
                    ? "num"
                    : undefined
                }
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
      </table>
      {groups.map((group) => (
        <div key={group.name} className="data-group">
          <div className="data-group-table">
            <table className="data-table">
              <tbody>
                {group.rows.map((row, ri) => (
                  <DataTableBodyRow
                    key={ri}
                    headers={headers}
                    row={row}
                    rowClass={group.rowClasses[ri]}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {group.chartSlices.length > 0 ? (
            <div className="data-group-chart">
              <TurnoutPieChart slices={group.chartSlices} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/** Renders one tbody row using the same rules as DataTable */
function DataTableBodyRow({
  headers,
  row,
  rowClass,
}: {
  headers: string[];
  row: CellValue[];
  rowClass: string;
}) {
  const labelCol = 0;
  const isNumericColumn = (colIndex: number) => {
    if (colIndex === 0) return false;
    const h = headers[colIndex] ?? "";
    return /%|registration|vote|turnout|early|mail/i.test(h);
  };

  const label = String(row[labelCol] ?? "");

  return (
    <tr className={rowClass}>
      {row.map((cell, ci) => {
        const text = cell == null || cell === "" ? "—" : String(cell);
        const isNum = isNumericColumn(ci);
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
}
