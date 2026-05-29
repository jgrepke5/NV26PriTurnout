import { buildLegislativeBlocks } from "@/lib/legislative";
import type { SheetTable } from "@/lib/types";
import { GroupedDataTable } from "./GroupedDataTable";

const INTRO =
  "Turnout and voting method in competitive legislative districts, with party breakdowns nested under each district total.";

export function LegislativeView({ sheet }: { sheet: SheetTable }) {
  const blocks = buildLegislativeBlocks(sheet);

  return (
    <section className="section" id="legislative">
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
              <GroupedDataTable
                headers={block.headers}
                groups={block.groups}
                variant={block.variant}
              />
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
