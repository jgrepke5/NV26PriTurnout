import { LegislativeView } from "@/components/LegislativeView";
import { ErrorPage } from "@/components/ErrorPage";
import { PageShell } from "@/components/PageShell";
import { getSheet, loadTurnoutData } from "@/lib/pages";

export const revalidate = 86400;

export default async function LegislativePage() {
  try {
    const snapshot = await loadTurnoutData();
    const legislative = getSheet(snapshot, "Legislative");

    return (
      <PageShell fetchedAt={snapshot.fetchedAt}>
        <LegislativeView sheet={legislative} />
      </PageShell>
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return <ErrorPage message={message} />;
  }
}
