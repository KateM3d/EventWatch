import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Icon, IconName } from './icon';

/** Centered message for empty, error and "coming soon" states. Project actions as content. */
@Component({
  selector: 'app-state-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: {
    class: 'flex flex-col items-center justify-center gap-3 px-6 py-12 text-center',
    '[attr.role]': "kind() === 'error' ? 'alert' : 'status'",
  },
  template: `
    <span
      class="flex size-12 items-center justify-center rounded-full"
      [class]="kind() === 'error' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'"
    >
      <app-icon class="size-6" [name]="icon()" />
    </span>
    <h2 class="text-base font-semibold text-slate-900">{{ heading() }}</h2>
    @if (message()) {
      <p class="max-w-md text-sm text-slate-600">{{ message() }}</p>
    }
    <ng-content />
  `,
})
export class StateMessage {
  readonly kind = input<'empty' | 'error' | 'info'>('empty');
  readonly icon = input<IconName>('empty');
  readonly heading = input.required<string>();
  readonly message = input('');
}
