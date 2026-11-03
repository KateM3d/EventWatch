import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { DATE_RANGES } from '../core/models/analytics.models';
import { DashboardContext } from '../core/state/dashboard-context';
import { Icon } from '../shared/ui/icon';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: {
    class:
      'sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8',
  },
  template: `
    <button
      type="button"
      class="focus-ring -ml-1 rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      aria-label="Open navigation"
      aria-controls="app-sidebar"
      [attr.aria-expanded]="menuExpanded()"
      (click)="menuOpened.emit()"
    >
      <app-icon class="size-5" name="menu" />
    </button>

    <label for="project-select" class="sr-only">Project</label>
    <select
      id="project-select"
      class="focus-ring h-9 min-w-0 rounded-lg border border-slate-300 bg-white py-0 pr-8 pl-3 text-sm font-medium text-slate-900 shadow-xs hover:border-slate-400 disabled:text-slate-400"
      [disabled]="context.projects().length === 0"
      (change)="onProjectChange($event)"
    >
      @for (project of context.projects(); track project.id) {
        <option [value]="project.id" [selected]="project.id === context.projectId()">
          {{ project.name }} · {{ project.environment }}
        </option>
      } @empty {
        <option>Loading projects…</option>
      }
    </select>

    <div
      class="ml-auto inline-flex shrink-0 rounded-lg border border-slate-300 bg-slate-100 p-0.5"
      role="group"
      aria-label="Date range"
    >
      @for (range of dateRanges; track range.value) {
        <button
          type="button"
          class="focus-ring rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
          [class]="
            range.value === context.dateRange()
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          "
          [attr.aria-pressed]="range.value === context.dateRange()"
          (click)="context.selectDateRange(range.value)"
        >
          {{ range.value }}<span class="sr-only"> (last {{ range.label }})</span>
        </button>
      }
    </div>
  `,
})
export class Header {
  readonly menuExpanded = input(false);
  readonly menuOpened = output();

  protected readonly context = inject(DashboardContext);
  protected readonly dateRanges = DATE_RANGES;

  protected onProjectChange(event: Event): void {
    this.context.selectProject((event.target as HTMLSelectElement).value);
  }
}
