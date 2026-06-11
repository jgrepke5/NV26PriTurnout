import { columnGroupClasses } from "@/lib/table-headers";

export function TableColGroup({ headers }: { headers: string[] }) {
  return (
    <colgroup>
      {headers.map((header, i) => (
        <col
          key={`${header}-${i}`}
          className={columnGroupClasses(header, i, headers)}
        />
      ))}
    </colgroup>
  );
}
