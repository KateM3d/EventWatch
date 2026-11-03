import {
  DATE_RANGES,
  DailyActiveUsersPoint,
  DateRange,
  FunnelStep,
  Kpi,
  OverviewData,
  Project,
  TopEvent,
} from '../models/analytics.models';

/**
 * Mock data is anchored to a fixed "last complete day" so that every run, test and screenshot
 * renders identical numbers. Replace with real API responses once the backend exists.
 */
export const MOCK_TODAY = '2026-11-02';

export const MOCK_PROJECTS: readonly Project[] = [
  { id: 'demoshop', name: 'DemoShop', environment: 'Production' },
  { id: 'demoshop-staging', name: 'DemoShop', environment: 'Staging' },
];

interface TrafficProfile {
  baseDailyActiveUsers: number;
  /** Fractional DAU growth per day, applied backwards from `MOCK_TODAY`. */
  dailyGrowth: number;
}

/** Projects without a profile have not tracked any events yet (exercises the empty state). */
const TRAFFIC_PROFILES: Readonly<Record<string, TrafficProfile>> = {
  demoshop: { baseDailyActiveUsers: 4200, dailyGrowth: 0.004 },
};

interface DayRecord {
  date: string;
  activeUsers: number;
  sessions: number;
  events: number;
  conversionRate: number;
}

interface PeriodSummary {
  activeUsers: number;
  sessions: number;
  events: number;
  conversionRate: number;
}

export function buildOverview(projectId: string, range: DateRange): OverviewData {
  const days = daysInRange(range);
  const profile = TRAFFIC_PROFILES[projectId];
  if (!profile) {
    return emptyOverview(range);
  }

  const records = generateDays(projectId, profile, days * 2);
  const previous = summarize(records.slice(0, days));
  const current = summarize(records.slice(days));
  const funnel = buildFunnel(projectId, range, current);

  return {
    range,
    kpis: buildKpis(current, previous),
    dailyActiveUsers: records
      .slice(days)
      .map<DailyActiveUsersPoint>(({ date, activeUsers }) => ({ date, users: activeUsers })),
    topEvents: buildTopEvents(projectId, range, current, previous, funnel),
    funnel,
  };
}

function daysInRange(range: DateRange): number {
  const match = DATE_RANGES.find((r) => r.value === range);
  if (!match) {
    throw new Error(`Unsupported date range: ${range}`);
  }
  return match.days;
}

function emptyOverview(range: DateRange): OverviewData {
  return {
    range,
    kpis: buildKpis(
      { activeUsers: 0, sessions: 0, events: 0, conversionRate: 0 },
      { activeUsers: 0, sessions: 0, events: 0, conversionRate: 0 },
    ),
    dailyActiveUsers: [],
    topEvents: [],
    funnel: [],
  };
}

/** Returns `count` consecutive days ending on `MOCK_TODAY`, oldest first. */
function generateDays(projectId: string, profile: TrafficProfile, count: number): DayRecord[] {
  const today = Date.parse(`${MOCK_TODAY}T00:00:00Z`);
  const records: DayRecord[] = [];

  for (let daysAgo = count - 1; daysAgo >= 0; daysAgo--) {
    const day = new Date(today - daysAgo * 86_400_000);
    const date = day.toISOString().slice(0, 10);
    // Seeding per calendar day keeps a given day's numbers stable across 7d and 30d views.
    const random = seededRandom(`${projectId}:${date}`);
    const weekday = day.getUTCDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const weekdayFactor = isWeekend ? 0.78 : weekday === 1 ? 1.04 : 1;
    const trend = 1 - profile.dailyGrowth * daysAgo;
    const noise = 0.94 + random() * 0.12;

    const activeUsers = Math.round(profile.baseDailyActiveUsers * trend * weekdayFactor * noise);
    const sessions = Math.round(activeUsers * (1.55 + random() * 0.25));
    const events = Math.round(sessions * (13 + random() * 4));
    const conversionRate = 0.029 + random() * 0.009 + (isWeekend ? 0.003 : 0);

    records.push({ date, activeUsers, sessions, events, conversionRate });
  }
  return records;
}

function summarize(records: DayRecord[]): PeriodSummary {
  const sum = (pick: (r: DayRecord) => number) => records.reduce((acc, r) => acc + pick(r), 0);
  const averageDau = sum((r) => r.activeUsers) / records.length;
  // Period-unique users grow sub-linearly with period length because users return across days.
  const uniqueUserFactor = 1 + 0.9 * Math.log(records.length);

  return {
    activeUsers: Math.round(averageDau * uniqueUserFactor),
    sessions: sum((r) => r.sessions),
    events: sum((r) => r.events),
    conversionRate: sum((r) => r.conversionRate) / records.length,
  };
}

function buildKpis(current: PeriodSummary, previous: PeriodSummary): Kpi[] {
  return [
    {
      id: 'activeUsers',
      label: 'Active Users',
      value: current.activeUsers,
      previousValue: previous.activeUsers,
      format: 'number',
    },
    {
      id: 'totalEvents',
      label: 'Total Events',
      value: current.events,
      previousValue: previous.events,
      format: 'number',
    },
    {
      id: 'sessions',
      label: 'Sessions',
      value: current.sessions,
      previousValue: previous.sessions,
      format: 'number',
    },
    {
      id: 'conversion',
      label: 'Conversion',
      value: current.conversionRate,
      previousValue: previous.conversionRate,
      format: 'percent',
    },
  ];
}

function buildFunnel(projectId: string, range: DateRange, period: PeriodSummary): FunnelStep[] {
  const random = seededRandom(`${projectId}:${range}:funnel`);
  const visited = period.activeUsers;
  const viewedProduct = Math.round(visited * (0.6 + random() * 0.05));
  const addedToCart = Math.round(viewedProduct * (0.39 + random() * 0.04));
  const startedCheckout = Math.round(addedToCart * (0.5 + random() * 0.05));
  const purchased = Math.min(startedCheckout, Math.round(visited * period.conversionRate));

  return [
    { name: 'Visited site', users: visited },
    { name: 'Viewed product', users: viewedProduct },
    { name: 'Added to cart', users: addedToCart },
    { name: 'Started checkout', users: startedCheckout },
    { name: 'Purchased', users: purchased },
  ];
}

function buildTopEvents(
  projectId: string,
  range: DateRange,
  current: PeriodSummary,
  previous: PeriodSummary,
  funnel: FunnelStep[],
): TopEvent[] {
  const funnelUsers = (index: number) => funnel[index]?.users ?? 0;
  const catalog: { name: string; share: number; uniqueUsers: number }[] = [
    { name: 'page_viewed', share: 0.36, uniqueUsers: Math.round(current.activeUsers * 0.98) },
    { name: 'product_viewed', share: 0.22, uniqueUsers: funnelUsers(1) },
    { name: 'search_performed', share: 0.08, uniqueUsers: Math.round(current.activeUsers * 0.36) },
    { name: 'add_to_cart', share: 0.03, uniqueUsers: funnelUsers(2) },
    { name: 'checkout_started', share: 0.006, uniqueUsers: funnelUsers(3) },
    {
      name: 'signup_completed',
      share: 0.0015,
      uniqueUsers: Math.round(current.activeUsers * 0.08),
    },
    { name: 'purchase_completed', share: 0.0008, uniqueUsers: funnelUsers(4) },
  ];

  return catalog
    .map(({ name, share, uniqueUsers }) => {
      const random = seededRandom(`${projectId}:${range}:${name}`);
      const count = Math.round(current.events * share * (0.92 + random() * 0.16));
      const previousCount = Math.round(previous.events * share * (0.92 + random() * 0.16));
      return { name, count, uniqueUsers: Math.min(uniqueUsers, count), previousCount };
    })
    .sort((a, b) => b.count - a.count);
}

/** Mulberry32 PRNG seeded with an FNV-1a hash of `seed`; returns values in [0, 1). */
function seededRandom(seed: string): () => number {
  let state = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    state = Math.imul(state ^ seed.charCodeAt(i), 16777619);
  }
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
