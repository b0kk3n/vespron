export type FreshnessStatus = "fresh" | "amber" | "due" | "untracked";

export interface FreshnessResult {
  status: FreshnessStatus;
  daysSince: number | null;
}

export function getFreshness(
  freshness_days: number | null,
  last_completed_at: string | null,
): FreshnessResult {
  if (freshness_days === null) return { status: "untracked", daysSince: null };

  if (last_completed_at === null) return { status: "due", daysSince: null };

  const daysSince =
    (Date.now() - new Date(last_completed_at).getTime()) /
    (1000 * 60 * 60 * 24);

  if (daysSince <= freshness_days) return { status: "fresh", daysSince };
  if (daysSince <= freshness_days * 2) return { status: "amber", daysSince };
  return { status: "due", daysSince };
}

export function needsAttention(status: FreshnessStatus): boolean {
  return status === "due" || status === "amber";
}
