export function Footer({ sourceUrl }: { sourceUrl: string }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          <strong>Data source:</strong> Figures are pulled automatically from
          the{" "}
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
            2026 Nevada Primary Turnout Statistics
          </a>{" "}
          spreadsheet. The raw voter-level tab is not published on this site.
        </p>
        <p>
          This page refreshes its cache daily at noon Pacific. Percentages and vote
          totals reflect the spreadsheet at the time of the last sync.
        </p>
      </div>
    </footer>
  );
}
