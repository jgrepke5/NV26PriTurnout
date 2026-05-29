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
      <tr>
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
  if (lines.length === 1) return <>{lines[0]}</>;

  return (
    <span className="th-lines">
      <span className="th-line">{lines[0]}</span>
      <span className="th-line">{lines[1]}</span>
    </span>
  );
}
