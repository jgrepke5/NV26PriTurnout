import { buildCountyBlocks } from "@/lib/county";
import type { SheetTable } from "@/lib/types";
import { DataTable } from "./DataTable";

const INTRO =
  "Turnout and voting method by county, with party breakdowns nested under each county total.";

export function CountyView({ sheet }: { sheet: SheetTable }) {
  const blocks = buildCountyBlocks(sheet);

  return (
    <section className="section" id="county">
      <div className="container">
        <header className="section-header">
          <p className="section-kicker">By the numbers</p>
          <h2 className="section-title">{sheet.title}</h2>
          <p className="section-intro">{INTRO}</p>
        </header>
      </div>
      <div className="county-blocks">
        {blocks.map((block) => (
          <section
            key={block.title ?? block.variant}
            className={`section data-block data-block--${block.variant}`}
          >
            <div className="container">
              {block.title ? (
                <header className="section-header">
                  <h3 className="section-title">{block.title}</h3>
                </header>
              ) : null}
              <DataTable
                headers={block.headers}
                rows={block.rows}
                rowClasses={block.rowClasses}
                variant={block.variant}
              />
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
