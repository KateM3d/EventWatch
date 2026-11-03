import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './header';
import { Sidebar } from './sidebar';

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Header, Sidebar],
  template: `
    <button
      type="button"
      class="focus-ring sr-only z-50 rounded-md bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      (click)="main.focus()"
    >
      Skip to main content
    </button>

    <app-sidebar [open]="sidebarOpen()" (closed)="sidebarOpen.set(false)" />

    <div class="flex min-h-dvh min-w-0 flex-col lg:pl-64" [attr.inert]="sidebarOpen() ? '' : null">
      <app-header [menuExpanded]="sidebarOpen()" (menuOpened)="sidebarOpen.set(true)" />
      <main #main id="main-content" tabindex="-1" class="flex-1 p-4 outline-none sm:p-6 lg:p-8">
        <div class="mx-auto max-w-7xl">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
})
export class Shell {
  protected readonly sidebarOpen = signal(false);
}
