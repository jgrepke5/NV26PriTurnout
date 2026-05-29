import type { DataGroup } from "@/lib/breakout-table";
import { displayLabel } from "@/lib/format";
import { isNumericHeader } from "@/lib/table-headers";
import type { CellValue } from "@/lib/types";
import { TableHeadRow } from "./TableHeadRow";
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
      {groups.map((group) => (
        <div key={group.name} className="data-group">
          <div className="data-group-table">
            <table className="data-table">
              <colgroup>
                <col className="col-label" />
                {headers.slice(1).map((h) => (
                  <col key={h} className="col-data" />
                ))}
              </colgroup>
              <TableHeadRow headers={headers} sticky />
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
          ) : (
            <div className="data-group-chart data-group-chart--empty" aria-hidden />
          )}
        </div>
      ))}
    </div>
  );
}

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

  return (
    <tr className={rowClass}>
      {row.map((cell, ci) => {
        const text = cell == null || cell === "" ? "—" : String(cell);
        const isNum = isNumericHeader(headers[ci] ?? "", ci);
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
