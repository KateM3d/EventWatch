import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { DailyActiveUsersPoint } from '../../../core/models/analytics.models';
import { formatCompact, formatInteger, formatShortDate } from '../../../shared/utils/format';

const INDIGO_600 = '#4f46e5';
const SLATE_200 = '#e2e8f0';
const SLATE_500 = '#64748b';

const CHART_OPTIONS: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 300 },
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      displayColors: false,
      callbacks: { label: (item) => `${formatInteger(item.parsed.y ?? 0)} active users` },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: SLATE_500, maxRotation: 0, autoSkipPadding: 16 },
    },
    y: {
      beginAtZero: true,
      border: { display: false },
      grid: { color: SLATE_200 },
      ticks: { color: SLATE_500, callback: (value) => formatCompact(Number(value)) },
    },
  },
};

@Component({
  selector: 'app-dau-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BaseChartDirective],
  host: { class: 'card flex flex-col p-5' },
  template: `
    <h2 class="text-base font-semibold text-slate-900">Daily Active Users</h2>
    <p class="text-sm text-slate-600">Unique users per day</p>
    <div class="relative mt-4 h-64 min-h-0 flex-1">
      <canvas
        baseChart
        type="line"
        role="img"
        [data]="data()"
        [options]="options"
        [attr.aria-label]="summary()"
      >
        {{ summary() }}
      </canvas>
    </div>
  `,
})
export class DauChart {
  readonly points = input.required<DailyActiveUsersPoint[]>();

  protected readonly options = CHART_OPTIONS;

  protected readonly data = computed<ChartData<'line'>>(() => {
    const points = this.points();
    return {
      labels: points.map((p) => formatShortDate(p.date)),
      datasets: [
        {
          data: points.map((p) => p.users),
          label: 'Active users',
          borderColor: INDIGO_600,
          backgroundColor: 'rgba(79, 70, 229, 0.08)',
          borderWidth: 2,
          fill: true,
          tension: 0.35,
          pointRadius: points.length > 14 ? 0 : 3,
          pointHoverRadius: 5,
          pointBackgroundColor: INDIGO_600,
        },
      ],
    };
  });

  protected readonly summary = computed(() => {
    const points = this.points();
    const first = points[0];
    const last = points.at(-1);
    if (!first || !last) {
      return 'No daily active user data for this period.';
    }
    const users = points.map((p) => p.users);
    return (
      `Daily active users from ${formatShortDate(first.date)} to ${formatShortDate(last.date)}: ` +
      `lowest ${formatInteger(Math.min(...users))}, highest ${formatInteger(Math.max(...users))}, ` +
      `latest ${formatInteger(last.users)}.`
    );
  });
}
