import { getFreshness, needsAttention } from "../freshness";

// Helper: ISO string for N days ago
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

describe("getFreshness", () => {
  describe("untracked — no freshness_days set", () => {
    it("returns untracked when freshness_days is null", () => {
      expect(getFreshness(null, null).status).toBe("untracked");
    });

    it("returns untracked even if there is a completion date", () => {
      expect(getFreshness(null, daysAgo(1)).status).toBe("untracked");
    });

    it("daysSince is null", () => {
      expect(getFreshness(null, daysAgo(3)).daysSince).toBeNull();
    });
  });

  describe("due — never completed", () => {
    it("returns due when last_completed_at is null and freshness_days is set", () => {
      expect(getFreshness(7, null).status).toBe("due");
    });

    it("daysSince is null when never completed", () => {
      expect(getFreshness(7, null).daysSince).toBeNull();
    });
  });

  describe("fresh — completed within freshness window", () => {
    it("returns fresh when completed today", () => {
      expect(getFreshness(7, daysAgo(0)).status).toBe("fresh");
    });

    it("returns fresh when completed exactly at the freshness_days boundary", () => {
      // just under the limit
      expect(getFreshness(7, daysAgo(6.9)).status).toBe("fresh");
    });

    it("daysSince is a positive number", () => {
      const { daysSince } = getFreshness(7, daysAgo(3));
      expect(daysSince).not.toBeNull();
      expect(daysSince!).toBeGreaterThan(2.9);
      expect(daysSince!).toBeLessThan(3.1);
    });
  });

  describe("amber — past freshness window but within 2x", () => {
    it("returns amber just past the freshness_days boundary", () => {
      expect(getFreshness(7, daysAgo(8)).status).toBe("amber");
    });

    it("returns amber at exactly 2x - epsilon", () => {
      expect(getFreshness(7, daysAgo(13.9)).status).toBe("amber");
    });
  });

  describe("due — past 2x freshness window", () => {
    it("returns due when well past 2x the freshness window", () => {
      expect(getFreshness(7, daysAgo(20)).status).toBe("due");
    });

    it("returns due just past 2x the boundary", () => {
      expect(getFreshness(7, daysAgo(14.1)).status).toBe("due");
    });
  });
});

describe("needsAttention", () => {
  it("returns true for due", () => expect(needsAttention("due")).toBe(true));
  it("returns true for amber", () =>
    expect(needsAttention("amber")).toBe(true));
  it("returns false for fresh", () =>
    expect(needsAttention("fresh")).toBe(false));
  it("returns false for untracked", () =>
    expect(needsAttention("untracked")).toBe(false));
});
