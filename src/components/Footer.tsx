export function Footer({ showComparisonNote = false }: { showComparisonNote?: boolean }) {
  return (
    <footer className="site-footer">
      <div className="container">
        {showComparisonNote ? (
          <p>
            2014 is added for comparison as this was Nevada&apos;s most recent
            mid-term election with an incumbent Republican Governor and no United
            States Senate race.
          </p>
        ) : null}
        <p>
          Voter registration statistics listed are active registered voters as of
          May 28, 2026.
        </p>
        <p>
          This page refreshes its cache daily at noon Pacific. Percentages and vote
          totals reflect the spreadsheet at the time of the last sync.
        </p>
      </div>
    </footer>
  );
}
