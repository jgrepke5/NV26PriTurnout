import { formatFetchedAt, nextRefreshAt } from "@/lib/format";

export function UpdateBanner({ fetchedAt }: { fetchedAt: string }) {
  return (
    <div className="update-banner" role="status">
      <div className="container">
        <span>
          <strong>Last updated:</strong> {formatFetchedAt(fetchedAt)}
        </span>
        <span>
          <strong>Next refresh:</strong> {nextRefreshAt()}
        </span>
      </div>
    </div>
  );
}
