import { packages, type PackageData } from "@/data/packages";

/**
 * Date-aware package status.
 *
 * Replaces the old "manual array order + slice(0, 8)" homepage selection with
 * a selector that cannot promote an expired event package. Historical data
 * stays in src/data/packages.ts untouched — only the presentation changes.
 */
export type PackageStatus =
  | "evergreen"       // available year-round
  | "in-season"       // month-range availability that includes today
  | "out-of-season"   // month-range availability that excludes today
  | "upcoming-event"  // event-tied, event end date is in the future
  | "expired-event";  // event-tied, event end date has passed

const MONTH_MAP: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

function monthIndex(name: string): number | undefined {
  return MONTH_MAP[name.slice(0, 3).toLowerCase()];
}

/** Parses the end date out of strings like "3–4 Apr 2026" or "27 Mar – 10 May 2026". */
export function parseEventEnd(eventDates: string): Date | null {
  const match = eventDates.match(/(\d{1,2})\s*([A-Za-z]{3,})\s*(\d{4})\s*$/);
  if (!match) return null;
  const month = monthIndex(match[2]);
  if (!month) return null;
  // End of the final event day, so the package stays "upcoming" through the event itself.
  return new Date(Number(match[3]), month - 1, Number(match[1]), 23, 59, 59);
}

export function getPackageStatus(pkg: PackageData, now: Date = new Date()): PackageStatus {
  if (pkg.eventDates) {
    const end = parseEventEnd(pkg.eventDates);
    // Unparseable event dates are treated as expired: never promote what we can't verify.
    if (!end || end < now) return "expired-event";
    return "upcoming-event";
  }

  if (/year.?round/i.test(pkg.availability)) return "evergreen";

  const range = pkg.availability.match(/([A-Za-z]{3,})\s*[—–-]\s*([A-Za-z]{3,})/);
  if (!range) return "evergreen"; // free-text availability — don't hide it on a parse failure
  const start = monthIndex(range[1]);
  const end = monthIndex(range[2]);
  if (!start || !end) return "evergreen";

  const month = now.getMonth() + 1;
  const inSeason = start <= end
    ? month >= start && month <= end
    : month >= start || month <= end;
  return inSeason ? "in-season" : "out-of-season";
}

/** A package that can honestly be offered today. */
export function isBookableNow(pkg: PackageData, now: Date = new Date()): boolean {
  const status = getPackageStatus(pkg, now);
  return status === "evergreen" || status === "in-season" || status === "upcoming-event";
}

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Badge copy for package cards. `active` drives the emphasis styling. */
export function getSeasonBadge(pkg: PackageData, now: Date = new Date()): { label: string; active: boolean } {
  const status = getPackageStatus(pkg, now);
  switch (status) {
    case "evergreen":
      return { label: "Available year-round", active: true };
    case "in-season":
      return { label: "In season now", active: true };
    case "upcoming-event":
      return { label: pkg.eventDates ?? "Upcoming", active: true };
    case "expired-event":
      return { label: `Past edition — ${pkg.eventDates ?? ""}`.trim(), active: false };
    case "out-of-season": {
      const range = pkg.availability.match(/([A-Za-z]{3,})\s*[—–-]\s*([A-Za-z]{3,})/);
      const start = range ? monthIndex(range[1]) : undefined;
      return { label: start ? `Opens ${SHORT_MONTHS[start - 1]}` : pkg.availability, active: false };
    }
  }
}

/**
 * Editorial ranking for the homepage. Order expresses curation, not data order:
 * the accessible evergreen first, the signature product second, the flagship third.
 */
const SIGNATURE_PRIORITY = [
  "alpine-reset",
  "cinematic-weekend",
  "grand-tour",
  "vineyard-valley",
  "winter-escape",
  "alpine-bloom",
  "spring-reset",
];

/** The homepage's three signature journeys — only packages that are honestly available now. */
export function getSignatureJourneys(count = 3, now: Date = new Date()): PackageData[] {
  const rank = (pkg: PackageData) => {
    const i = SIGNATURE_PRIORITY.indexOf(pkg.id);
    return i === -1 ? SIGNATURE_PRIORITY.length : i;
  };
  return packages
    .filter((pkg) => isBookableNow(pkg, now))
    .sort((a, b) => rank(a) - rank(b))
    .slice(0, count);
}
