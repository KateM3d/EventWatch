import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FunnelStep } from '../../../core/models/analytics.models';
import { formatInteger, formatPercent } from '../../../shared/utils/format';

@Component({
  selector: 'app-funnel-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  host: { class: 'card flex flex-col p-5' },
  template: `
    <div class="flex items-start justify-between gap-2">
      <div>
        <h2 class="text-base font-semibold text-slate-900">Purchase Funnel</h2>
        <p class="text-sm text-slate-600">Share of visitors reaching each step</p>
      </div>
      <a
        routerLink="/funnels"
        class="focus-ring shrink-0 rounded text-sm font-medium text-indigo-700 hover:text-indigo-900"
        >View all<span class="sr-only"> funnels</span></a
      >
    </div>

    @if (rows().length) {
      <ol class="mt-4 flex-1 space-y-3">
        @for (row of rows(); track row.name) {
          <li>
            <div class="flex items-baseline justify-between gap-2 text-sm">
              <span class="font-medium text-slate-700">{{ row.name }}</span>
              <span class="text-slate-900 tabular-nums">
                {{ row.users }} <span class="text-slate-500">· {{ row.share }}</span>
              </span>
            </div>
            <div class="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
              <div class="h-full rounded-full bg-indigo-500" [style.width.%]="row.widthPct"></div>
            </div>
          </li>
        }
      </ol>
      <p class="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-600">
        Overall conversion
        <span class="font-semibold text-slate-900 tabular-nums">{{ overallConversion() }}</span>
      </p>
    } @else {
      <p class="flex-1 py-8 text-center text-sm text-slate-500">No funnel data for this period.</p>
    }
  `,
})
export class FunnelPreview {
  readonly steps = input.required<FunnelStep[]>();

  private readonly entryUsers = computed(() => this.steps()[0]?.users ?? 0);

  protected readonly rows = computed(() => {
    const entry = this.entryUsers();
    return this.steps().map((step) => {
      const ratio = entry === 0 ? 0 : step.users / entry;
      return {
        name: step.name,
        users: formatInteger(step.users),
        share: formatPercent(ratio),
        widthPct: Math.max(ratio * 100, 1),
      };
    });
  });

  protected readonly overallConversion = computed(() => {
    const entry = this.entryUsers();
    const last = this.steps().at(-1)?.users ?? 0;
    return formatPercent(entry === 0 ? 0 : last / entry);
  });
}
