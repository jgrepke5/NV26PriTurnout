import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { unstable_cache, revalidateTag } from "next/cache";
import { fetchTurnoutSnapshot } from "./sheets";
import { isCacheStale } from "./schedule";
import type { TurnoutSnapshot } from "./types";

const CACHE_TAG = "turnout-data";
const REVALIDATE_SECONDS = 86400;
const LOCAL_CACHE_PATH = path.join(process.cwd(), "data", "cache.json");

const isVercel = Boolean(process.env.VERCEL);

const getCachedSnapshot = unstable_cache(
  async () => fetchTurnoutSnapshot(),
  ["turnout-snapshot"],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] },
);

async function readLocalCache(): Promise<TurnoutSnapshot | null> {
  try {
    const raw = await readFile(LOCAL_CACHE_PATH, "utf-8");
    return JSON.parse(raw) as TurnoutSnapshot;
  } catch {
    return null;
  }
}

async function writeLocalCache(snapshot: TurnoutSnapshot): Promise<void> {
  await mkdir(path.dirname(LOCAL_CACHE_PATH), { recursive: true });
  await writeFile(LOCAL_CACHE_PATH, JSON.stringify(snapshot, null, 2), "utf-8");
}

/** Bust cache and fetch fresh data (used by cron / manual sync). */
export async function refreshSnapshot(): Promise<TurnoutSnapshot> {
  revalidateTag(CACHE_TAG);
  const snapshot = await fetchTurnoutSnapshot();
  if (!isVercel) {
    await writeLocalCache(snapshot);
  }
  return snapshot;
}

export async function getSnapshot(force = false): Promise<TurnoutSnapshot> {
  if (force) {
    return refreshSnapshot();
  }

  if (isVercel) {
    return getCachedSnapshot();
  }

  const cached = await readLocalCache();
  if (cached && !isCacheStale(cached.fetchedAt)) {
    return cached;
  }

  const snapshot = await fetchTurnoutSnapshot();
  await writeLocalCache(snapshot);
  return snapshot;
}
