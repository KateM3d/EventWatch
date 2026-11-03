import {
  formatCompact,
  formatInteger,
  formatPercent,
  formatShortDate,
  formatSignedPercent,
  relativeChange,
} from './format';

describe('format utils', () => {
  it('formats numbers', () => {
    expect(formatInteger(1234567)).toBe('1,234,567');
    expect(formatCompact(48_200)).toBe('48.2K');
    expect(formatPercent(0.0342)).toBe('3.4%');
    expect(formatSignedPercent(0.125)).toBe('+12.5%');
    expect(formatSignedPercent(-0.05)).toBe('-5.0%');
  });

  it('formats ISO dates independent of the local time zone', () => {
    expect(formatShortDate('2026-11-02')).toBe('Nov 2');
  });

  it('computes relative change and handles a zero baseline', () => {
    expect(relativeChange(110, 100)).toBeCloseTo(0.1);
    expect(relativeChange(5, 0)).toBeNull();
  });
});
