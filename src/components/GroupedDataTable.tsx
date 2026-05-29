"use client";

import type { DataGroup } from "@/lib/breakout-table";
import { isNumericHeader } from "@/lib/table-headers";
import type { CellValue } from "@/lib/types";
import { useCallback, useRef, type ReactNode, type UIEvent } from "react";
import { RowLabel } from "./RowLabel";
import { TableHeadRow } from "./TableHeadRow";
import { TurnoutPieChart } from "./TurnoutPieChart";

export type { DataGroup };

function TableColGroup({ headers }: { headers: string[] }) {
  return (
    <colgroup>
      <col className="col-label" />
      {headers.slice(1).map((h) => (
        <col key={h} className="col-data" />
      ))}
    </colgroup>
  );
}

function TableScroll({
  children,
  onScroll,
}: {
  children: ReactNode;
  onScroll: (e: UIEvent<HTMLDivElement>) => void;
}) {
  return (
    <div className="table-scroll" onScroll={onScroll}>
      {children}
    </div>
  );
}

export function GroupedDataTable({
  headers,
  groups,
  variant,
}: {
  headers: string[];
  groups: DataGroup[];
  variant?: "default" | "current" | "historical" | "rural";
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const syncingRef = useRef(false);

  const handleTableScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    if (syncingRef.current) return;
    const scrollLeft = e.currentTarget.scrollLeft;
    const root = rootRef.current;
    if (!root) return;

    syncingRef.current = true;
    root.querySelectorAll<HTMLElement>(".table-scroll").forEach((el) => {
      if (el !== e.currentTarget) {
        el.scrollLeft = scrollLeft;
      }
    });
    syncingRef.current = false;
  }, []);

  return (
    <div
      ref={rootRef}
      className={`table-wrap table-wrap--${variant ?? "default"} grouped-table`}
    >
      <div className="grouped-table-sticky-head">
        <div className="data-group grouped-table-sticky-head-row">
          <div className="data-group-table">
            <TableScroll onScroll={handleTableScroll}>
              <table className="data-table">
                <TableColGroup headers={headers} />
                <TableHeadRow headers={headers} />
              </table>
            </TableScroll>
          </div>
          <div
            className="data-group-chart data-group-chart--empty grouped-table-sticky-head-spacer"
            aria-hidden
          />
        </div>
      </div>
      {groups.map((group) => (
        <div key={group.name} className="data-group">
          <div className="data-group-table">
            <TableScroll onScroll={handleTableScroll}>
              <table className="data-table">
                <TableColGroup headers={headers} />
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
            </TableScroll>
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
            {ci === labelCol ? <RowLabel text={text} /> : text}
          </td>
        );
      })}
    </tr>
  );
}
