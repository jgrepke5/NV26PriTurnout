import { buildCommissionBlocks } from "@/lib/commission";
import type { SheetTable } from "@/lib/types";
import { GroupedDataTable } from "./GroupedDataTable";

export function CommissionView({ sheet }: { sheet: SheetTable }) {
  const blocks = buildCommissionBlocks(sheet);

  return (
    <section className="section" id="commission">
      <div className="commission-blocks county-blocks legislative-blocks">
        {blocks.map((block) => (
          <section
            key={block.title ?? block.variant}
            className={`section data-block data-block--${block.variant}`}
          >
            <div className="container">
              {block.title ? (
                <header className="section-header block-title-header">
                  <h2 className="section-title">{block.title}</h2>
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
