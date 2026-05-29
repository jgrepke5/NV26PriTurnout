import { buildStatewideBlocks } from "@/lib/statewide";
import type { SheetTable } from "@/lib/types";
import { DataTable } from "./DataTable";
import { TurnoutPieChart } from "./TurnoutPieChart";

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
            {block.chartSlices && block.chartSlices.length > 0 ? (
              <div className="data-block-layout">
                <div className="data-block-table">
                  <DataTable
                    headers={block.headers}
                    rows={block.rows}
                    variant={block.variant}
                    stickyHeader
                  />
                </div>
                <aside className="data-block-chart">
                  <TurnoutPieChart slices={block.chartSlices} />
                </aside>
              </div>
            ) : (
              <DataTable
                headers={block.headers}
                rows={block.rows}
                variant={block.variant}
              />
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
