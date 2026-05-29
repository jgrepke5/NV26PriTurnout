import { buildStatewideBlocks } from "@/lib/statewide";
import type { SheetTable } from "@/lib/types";
import { DataTable } from "./DataTable";

export function StatewideView({ sheet }: { sheet: SheetTable }) {
  const blocks = buildStatewideBlocks(sheet);

  return (
    <div className="statewide-blocks">
      {blocks.map((block) => (
        <section
          key={block.title}
          className={`section data-block data-block--${block.variant}`}
        >
          <div className="container">
            <header className="section-header">
              <h2 className="section-title">{block.title}</h2>
            </header>
            <DataTable
              headers={block.headers}
              rows={block.rows}
              variant={block.variant}
            />
          </div>
        </section>
      ))}
    </div>
  );
}
