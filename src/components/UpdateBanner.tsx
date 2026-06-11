import { formatFetchedAt } from "@/lib/format";

export function UpdateBanner({ fetchedAt }: { fetchedAt: string }) {
  return (
    <div className="update-banner" role="status">
      <div className="container">
        <span>
          <strong>Last updated:</strong> {formatFetchedAt(fetchedAt)}
        </span>
      </div>
    </div>
  );
}
