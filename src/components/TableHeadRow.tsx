import { headerLines, isNumericHeader } from "@/lib/table-headers";

export function TableHeadRow({
  headers,
  sticky = false,
  groupNameColumn = false,
}: {
  headers: string[];
  sticky?: boolean;
  groupNameColumn?: boolean;
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
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <HeaderLabel label={h} isGroupName={groupNameColumn && i === 0} />
          </th>
        ))}
      </tr>
    </thead>
  );
}

function HeaderLabel({
  label,
  isGroupName = false,
}: {
  label: string;
  isGroupName?: boolean;
}) {
  if (isGroupName) {
    return <span className="th-group-name">{label}</span>;
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
