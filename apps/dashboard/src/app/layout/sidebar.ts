import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  afterRenderEffect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Icon, IconName } from '../shared/ui/icon';

interface NavItem {
  label: string;
  path: string;
  icon: IconName;
}

/** Each group renders as its own list; the last group is pinned to the bottom. */
const NAV_GROUPS: readonly (readonly NavItem[])[] = [
  [
    { label: 'Overview', path: '/overview', icon: 'overview' },
    { label: 'Events', path: '/events', icon: 'events' },
    { label: 'Users', path: '/users', icon: 'users' },
    { label: 'Funnels', path: '/funnels', icon: 'funnels' },
  ],
  [{ label: 'Settings', path: '/settings', icon: 'settings' }],
];

/**
 * Persistent sidebar on large screens; an off-canvas drawer below the `lg` breakpoint whose
 * visibility is controlled by the shell.
 */
@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Icon],
  host: { '(document:keydown.escape)': 'open() && closed.emit()' },
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
        aria-hidden="true"
        (click)="closed.emit()"
      ></div>
    }

    <aside
      id="app-sidebar"
      class="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white duration-200 lg:visible lg:translate-x-0"
      [class]="
        open()
          ? 'transition-[translate]'
          : 'invisible -translate-x-full transition-[translate,visibility]'
      "
      aria-label="Sidebar"
    >
      <div class="flex h-16 items-center justify-between gap-2 border-b border-slate-200 px-5">
        <a routerLink="/overview" class="focus-ring flex items-center gap-2 rounded-md">
          <span
            class="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white"
            aria-hidden="true"
            >EW</span
          >
          <span class="text-base font-semibold tracking-tight text-slate-900">EventWatch</span>
        </a>
        <button
          #closeButton
          type="button"
          class="focus-ring rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          aria-label="Close navigation"
          (click)="closed.emit()"
        >
          <app-icon class="size-5" name="close" />
        </button>
      </div>

      <nav class="flex flex-1 flex-col overflow-y-auto p-3" aria-label="Main">
        @for (group of navGroups; track $index; let last = $last) {
          <ul class="space-y-1" [class]="last ? 'mt-auto border-t border-slate-200 pt-3' : ''">
            @for (item of group; track item.path) {
              <li>
                <a
                  class="focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  [routerLink]="item.path"
                  routerLinkActive="bg-indigo-50! text-indigo-700!"
                  ariaCurrentWhenActive="page"
                  (click)="closed.emit()"
                >
                  <app-icon class="size-5" [name]="item.icon" />
                  {{ item.label }}
                </a>
              </li>
            }
          </ul>
        }
      </nav>
    </aside>
  `,
})
export class Sidebar {
  readonly open = input(false);
  readonly closed = output();

  protected readonly navGroups = NAV_GROUPS;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly closeButton = viewChild.required<ElementRef<HTMLButtonElement>>('closeButton');

  constructor() {
    let wasOpen = false;
    // Visibility only transitions on close, so the drawer is focusable as soon as it opens.
    afterRenderEffect(() => {
      const open = this.open();
      if (open) {
        this.closeButton().nativeElement.focus();
      } else if (wasOpen && this.host.nativeElement.contains(this.document.activeElement)) {
        this.document.querySelector<HTMLElement>('[aria-controls="app-sidebar"]')?.focus();
      }
      wasOpen = open;
    });
  }
}
