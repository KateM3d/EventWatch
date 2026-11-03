import { MOCK_TODAY, buildOverview } from './mock-data';

describe('buildOverview', () => {
  it('is deterministic for the same project and range', () => {
    expect(buildOverview('demoshop', '30d')).toEqual(buildOverview('demoshop', '30d'));
  });

  it.each([
    ['7d', 7],
    ['30d', 30],
  ] as const)('returns one daily point per day for %s, ending on MOCK_TODAY', (range, days) => {
    const { dailyActiveUsers } = buildOverview('demoshop', range);

    expect(dailyActiveUsers).toHaveLength(days);
    expect(dailyActiveUsers.at(-1)?.date).toBe(MOCK_TODAY);
    expect(dailyActiveUsers.every((p) => p.users > 0)).toBe(true);
  });

  it('keeps per-day numbers consistent across ranges', () => {
    const week = buildOverview('demoshop', '7d').dailyActiveUsers;
    const month = buildOverview('demoshop', '30d').dailyActiveUsers;

    expect(month.slice(-7)).toEqual(week);
  });

  it('returns the four overview KPIs with a conversion ratio between 0 and 1', () => {
    const { kpis } = buildOverview('demoshop', '7d');

    expect(kpis.map((k) => k.id)).toEqual(['activeUsers', 'totalEvents', 'sessions', 'conversion']);
    const conversion = kpis.find((k) => k.id === 'conversion');
    expect(conversion?.value).toBeGreaterThan(0);
    expect(conversion?.value).toBeLessThan(1);
  });

  it('produces a monotonically decreasing funnel', () => {
    const users = buildOverview('demoshop', '30d').funnel.map((s) => s.users);

    expect(users).toHaveLength(5);
    users.slice(1).forEach((value, i) => expect(value).toBeLessThanOrEqual(users[i] ?? 0));
  });

  it('sorts top events by count, descending', () => {
    const counts = buildOverview('demoshop', '7d').topEvents.map((e) => e.count);

    expect(counts).toEqual([...counts].sort((a, b) => b - a));
  });

  it('returns an empty dataset for projects without traffic', () => {
    const overview = buildOverview('demoshop-staging', '7d');

    expect(overview.dailyActiveUsers).toEqual([]);
    expect(overview.topEvents).toEqual([]);
    expect(overview.funnel).toEqual([]);
    expect(overview.kpis.every((k) => k.value === 0)).toBe(true);
  });
});
