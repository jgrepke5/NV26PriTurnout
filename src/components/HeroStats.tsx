import { extractHeroMetrics } from "@/lib/parse";
import type { SheetTable } from "@/lib/types";

export function HeroStats({ statewide }: { statewide: SheetTable | undefined }) {
  if (!statewide) return null;

  const hero = extractHeroMetrics(statewide);
  if (!hero) return null;

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <article className="stat-card">
            <p className="stat-label">Votes cast to date</p>
            <p className="stat-value">{hero.votes}</p>
            <p className="stat-note">Statewide total, all parties</p>
          </article>
          <article className="stat-card">
            <p className="stat-label">2026 turnout rate</p>
            <p className="stat-value">{hero.turnout}</p>
            <p className="stat-note">Share of registered voters</p>
          </article>
          <article className="stat-card">
            <p className="stat-label">Registered voters</p>
            <p className="stat-value">{hero.registered}</p>
            <p className="stat-note">Active registration base</p>
          </article>
        </div>
        <p className="lead">
          Nevada&apos;s 2026 primary is underway. The tables below show
          current participation and historical turnout benchmarks by party.
          Use the tabs above for county and legislative district breakouts.
        </p>
      </div>
    </section>
  );
}
