/** Daily sync at noon Pacific — matches vercel.json cron */
const TZ = "America/Los_Angeles";
const SYNC_HOUR = 12;

function dateYmdInTz(d: Date): string {
  return d.toLocaleDateString("en-CA", { timeZone: TZ });
}

export function noonPacific(ymd: string): Date {
  for (const offset of ["-08:00", "-07:00"]) {
    const h = String(SYNC_HOUR).padStart(2, "0");
    const candidate = new Date(`${ymd}T${h}:00:00${offset}`);
    if (dateYmdInTz(candidate) === ymd) return candidate;
  }
  throw new Error(`Could not resolve noon Pacific for ${ymd}`);
}

/** Most recent scheduled sync at or before `moment` */
export function lastSyncBefore(moment: Date = new Date()): Date {
  const todayNoon = noonPacific(dateYmdInTz(moment));
  if (moment >= todayNoon) return todayNoon;
  const yesterday = new Date(moment.getTime() - 86_400_000);
  return noonPacific(dateYmdInTz(yesterday));
}

/** Next scheduled sync strictly after `moment` */
export function nextSyncAfter(moment: Date = new Date()): Date {
  const todayNoon = noonPacific(dateYmdInTz(moment));
  if (moment < todayNoon) return todayNoon;
  const tomorrow = new Date(moment.getTime() + 86_400_000);
  return noonPacific(dateYmdInTz(tomorrow));
}

export function isCacheStale(fetchedAt: string): boolean {
  return new Date(fetchedAt) < lastSyncBefore();
}
