import { Routes } from '@angular/router';

import { Shell } from './layout/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        title: 'Overview · EventWatch',
        loadChildren: () => import('./features/overview/overview.routes'),
      },
      {
        path: 'events',
        title: 'Events · EventWatch',
        loadComponent: () => import('./features/events/events-page').then((m) => m.EventsPage),
      },
      {
        path: 'users',
        title: 'Users · EventWatch',
        loadComponent: () => import('./features/users/users-page').then((m) => m.UsersPage),
      },
      {
        path: 'funnels',
        title: 'Funnels · EventWatch',
        loadComponent: () => import('./features/funnels/funnels-page').then((m) => m.FunnelsPage),
      },
      {
        path: 'settings',
        title: 'Settings · EventWatch',
        loadComponent: () =>
          import('./features/settings/settings-page').then((m) => m.SettingsPage),
      },
      { path: '**', redirectTo: 'overview' },
    ],
  },
];
