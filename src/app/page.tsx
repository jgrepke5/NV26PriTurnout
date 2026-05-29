import { ErrorPage } from "@/components/ErrorPage";
import { HeroStats } from "@/components/HeroStats";
import { PageShell } from "@/components/PageShell";
import { StatewideView } from "@/components/StatewideView";
import { getSheet, loadTurnoutData } from "@/lib/pages";

export const revalidate = 86400;

export default async function StatewidePage() {
  try {
    const snapshot = await loadTurnoutData();
    const statewide = getSheet(snapshot, "Statewide");
    const turnoutComparison = snapshot.sheets.find(
      (s) => s.title.toLowerCase() === "turnout comparison by state",
    );

    return (
      <PageShell fetchedAt={snapshot.fetchedAt} showComparisonNote>
        <HeroStats statewide={statewide} />
        <StatewideView
          sheet={statewide}
          turnoutComparison={turnoutComparison ?? null}
        />
      </PageShell>
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return <ErrorPage message={message} />;
  }
}
