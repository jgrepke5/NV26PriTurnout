import { headerLines, isNumericHeader } from "@/lib/table-headers";

export function TableHeadRow({
  headers,
  sticky = false,
}: {
  headers: string[];
  sticky?: boolean;
}) {
  return (
    <thead className={sticky ? "data-group-thead" : undefined}>
      <tr>
        {headers.map((h, i) => (
          <th
            key={`${h}-${i}`}
            className={isNumericHeader(h, i) ? "num" : undefined}
          >
            <HeaderLabel label={h} />
          </th>
        ))}
      </tr>
    </thead>
  );
}

function HeaderLabel({ label }: { label: string }) {
  const lines = headerLines(label);
  if (lines.length === 1) return <>{lines[0]}</>;

  return (
    <span className="th-lines">
      <span className="th-line">{lines[0]}</span>
      <span className="th-line">{lines[1]}</span>
    </span>
  );
}
