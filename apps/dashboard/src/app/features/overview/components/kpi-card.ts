import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Kpi } from '../../../core/models/analytics.models';
import { formatInteger, formatPercent, relativeChange } from '../../../shared/utils/format';

@Component({
  selector: 'app-kpi-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card block p-5' },
  template: `
    <p class="text-sm font-medium text-slate-600">{{ kpi().label }}</p>
    <p class="mt-2 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
      {{ value() }}
    </p>
    <p class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
      @if (change(); as change) {
        <span
          class="inline-flex items-center rounded-full px-2 py-0.5 font-medium tabular-nums"
          [class]="change.className"
        >
          <span aria-hidden="true">{{ change.arrow }}</span>
          <span class="sr-only">{{ change.direction }}</span>
          {{ change.text }}
        </span>
      }
      <span>vs. previous {{ periodLabel() }}</span>
    </p>
  `,
})
export class KpiCard {
  readonly kpi = input.required<Kpi>();
  readonly periodLabel = input.required<string>();

  protected readonly value = computed(() => {
    const { value, format } = this.kpi();
    return format === 'percent' ? formatPercent(value) : formatInteger(value);
  });

  protected readonly change = computed(() => {
    const { value, previousValue } = this.kpi();
    const ratio = relativeChange(value, previousValue);
    if (ratio === null) {
      return null;
    }
    if (Math.abs(ratio) < 0.0005) {
      return {
        text: '0%',
        arrow: '→',
        direction: 'No change',
        className: 'bg-slate-100 text-slate-700',
      };
    }
    const up = ratio > 0;
    return {
      text: formatPercent(Math.abs(ratio)),
      arrow: up ? '↑' : '↓',
      direction: up ? 'Increased by' : 'Decreased by',
      className: up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
    };
  });
}
