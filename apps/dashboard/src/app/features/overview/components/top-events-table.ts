import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { TopEvent } from '../../../core/models/analytics.models';
import { formatInteger, formatSignedPercent, relativeChange } from '../../../shared/utils/format';

@Component({
  selector: 'app-top-events-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card block overflow-hidden' },
  template: `
    <div class="px-5 pt-5 pb-3">
      <h2 id="top-events-heading" class="text-base font-semibold text-slate-900">Top Events</h2>
      <p class="text-sm text-slate-600">Most frequent events in the selected period</p>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full min-w-[32rem] text-left text-sm" aria-labelledby="top-events-heading">
        <thead class="border-y border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
          <tr>
            <th scope="col" class="px-5 py-2.5 font-medium">Event</th>
            <th scope="col" class="px-5 py-2.5 text-right font-medium">Count</th>
            <th scope="col" class="px-5 py-2.5 text-right font-medium">Unique users</th>
            <th scope="col" class="px-5 py-2.5 text-right font-medium">Change</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          @for (row of rows(); track row.name) {
            <tr class="hover:bg-slate-50">
              <th scope="row" class="px-5 py-3 font-normal">
                <code class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">{{
                  row.name
                }}</code>
              </th>
              <td class="px-5 py-3 text-right text-slate-900 tabular-nums">{{ row.count }}</td>
              <td class="px-5 py-3 text-right text-slate-600 tabular-nums">
                {{ row.uniqueUsers }}
              </td>
              <td class="px-5 py-3 text-right font-medium tabular-nums" [class]="row.changeClass">
                {{ row.change }}
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="4" class="px-5 py-8 text-center text-slate-500">
                No events were tracked in this period.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class TopEventsTable {
  readonly events = input.required<TopEvent[]>();

  protected readonly rows = computed(() =>
    this.events().map((event) => {
      const change = relativeChange(event.count, event.previousCount);
      return {
        name: event.name,
        count: formatInteger(event.count),
        uniqueUsers: formatInteger(event.uniqueUsers),
        change: change === null ? '—' : formatSignedPercent(change),
        changeClass:
          change === null || change === 0
            ? 'text-slate-500'
            : change > 0
              ? 'text-emerald-700'
              : 'text-red-700',
      };
    }),
  );
}
