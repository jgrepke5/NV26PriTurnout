import {
  headerLines,
  isComparisonStateHeader,
  isNumericHeader,
} from "@/lib/table-headers";

export function TableHeadRow({
  headers,
  sticky = false,
  groupNameColumn = false,
  compactStateHeaders = false,
}: {
  headers: string[];
  sticky?: boolean;
  groupNameColumn?: boolean;
  compactStateHeaders?: boolean;
}) {
  return (
    <thead className={sticky ? "data-group-thead" : undefined}>
      <tr className={sticky ? "data-group-thead-sticky" : undefined}>
        {headers.map((h, i) => (
          <th
            key={`${h}-${i}`}
            className={[
              isNumericHeader(h, i) ? "num" : undefined,
              groupNameColumn && i === 0 ? "th-group-name" : undefined,
              compactStateHeaders && isComparisonStateHeader(h)
                ? "th-state-col"
                : undefined,
              compactStateHeaders &&
              i > 0 &&
              !isComparisonStateHeader(h)
                ? "th-metric-col"
                : undefined,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <HeaderLabel
              label={h}
              isGroupName={groupNameColumn && i === 0}
              nowrap={compactStateHeaders && isComparisonStateHeader(h)}
            />
          </th>
        ))}
      </tr>
    </thead>
  );
}

function HeaderLabel({
  label,
  isGroupName = false,
  nowrap = false,
}: {
  label: string;
  isGroupName?: boolean;
  nowrap?: boolean;
}) {
  if (isGroupName) {
    return <span className="th-group-name">{label}</span>;
  }

  if (nowrap) {
    return <span className="th-line th-line--nowrap">{label}</span>;
  }

  const lines = headerLines(label);
  if (lines.length === 1) {
    return <span className="th-line th-line--wrap">{lines[0]}</span>;
  }

  return (
    <span className="th-lines">
      {lines.map((line) => (
        <span key={line} className="th-line">
          {line}
        </span>
      ))}
    </span>
  );
}
