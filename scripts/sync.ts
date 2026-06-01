import { fetchAndPersistSnapshot } from "../src/lib/cache";

async function main() {
  console.log("Syncing turnout data from Google Sheets…");
  const snapshot = await fetchAndPersistSnapshot();
  console.log(`Done. Fetched at ${snapshot.fetchedAt}`);
  for (const sheet of snapshot.sheets) {
    console.log(`  · ${sheet.title}: ${sheet.rows.length} rows`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
