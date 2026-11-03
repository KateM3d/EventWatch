import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'mb-6 flex flex-wrap items-end justify-between gap-4' },
  template: `
    <div class="min-w-0">
      <h1 class="text-2xl font-semibold tracking-tight text-slate-900">{{ heading() }}</h1>
      @if (description()) {
        <p class="mt-1 text-sm text-slate-600">{{ description() }}</p>
      }
    </div>
    <ng-content />
  `,
})
export class PageHeader {
  readonly heading = input.required<string>();
  readonly description = input('');
}
