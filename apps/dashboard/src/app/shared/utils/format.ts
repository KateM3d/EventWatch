const LOCALE = 'en-US';

const integerFormat = new Intl.NumberFormat(LOCALE);
const compactFormat = new Intl.NumberFormat(LOCALE, {
  notation: 'compact',
  maximumFractionDigits: 1,
});
const percentFormat = new Intl.NumberFormat(LOCALE, {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const signedPercentFormat = new Intl.NumberFormat(LOCALE, {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
});
const shortDateFormat = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

export const formatInteger = (value: number): string => integerFormat.format(value);
export const formatCompact = (value: number): string => compactFormat.format(value);
/** Formats a 0..1 ratio, e.g. `0.034` → `3.4%`. */
export const formatPercent = (ratio: number): string => percentFormat.format(ratio);
/** Formats a signed ratio, e.g. `0.12` → `+12.0%`. */
export const formatSignedPercent = (ratio: number): string => signedPercentFormat.format(ratio);
/** Formats an ISO `YYYY-MM-DD` date as e.g. `Oct 27`. */
export const formatShortDate = (isoDate: string): string =>
  shortDateFormat.format(new Date(`${isoDate}T00:00:00Z`));

/** Relative change between two values as a ratio, or `null` when there is no baseline. */
export function relativeChange(current: number, previous: number): number | null {
  return previous === 0 ? null : (current - previous) / previous;
}
