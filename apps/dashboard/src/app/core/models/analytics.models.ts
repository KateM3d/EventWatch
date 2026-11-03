export type DateRange = '7d' | '30d';

export const DATE_RANGES: readonly { value: DateRange; label: string; days: number }[] = [
  { value: '7d', label: '7 days', days: 7 },
  { value: '30d', label: '30 days', days: 30 },
];

export interface Project {
  id: string;
  name: string;
  environment: 'Production' | 'Staging';
}

export type KpiId = 'activeUsers' | 'totalEvents' | 'sessions' | 'conversion';

export interface Kpi {
  id: KpiId;
  label: string;
  value: number;
  /** Value for the preceding period of equal length, used for trend comparison. */
  previousValue: number;
  /** `percent` values are ratios in the range 0..1. */
  format: 'number' | 'percent';
}

export interface DailyActiveUsersPoint {
  /** ISO calendar date, `YYYY-MM-DD`. */
  date: string;
  users: number;
}

export interface TopEvent {
  name: string;
  count: number;
  uniqueUsers: number;
  previousCount: number;
}

export interface FunnelStep {
  name: string;
  users: number;
}

export interface OverviewData {
  range: DateRange;
  kpis: Kpi[];
  dailyActiveUsers: DailyActiveUsersPoint[];
  topEvents: TopEvent[];
  funnel: FunnelStep[];
}
