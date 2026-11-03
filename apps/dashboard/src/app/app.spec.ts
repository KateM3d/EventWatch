import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { NEVER, of } from 'rxjs';

import { routes } from './app.routes';
import { AnalyticsApi } from './core/api/analytics-api';
import { MOCK_PROJECTS } from './core/api/mock-data';

describe('App routing', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        {
          provide: AnalyticsApi,
          useValue: { getProjects: () => of(MOCK_PROJECTS), getOverview: () => NEVER },
        },
      ],
    });
  });

  it('redirects the root URL to the overview', async () => {
    const harness = await RouterTestingHarness.create('/');

    expect(TestBed.inject(Router).url).toBe('/overview');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Overview');
  });

  it('renders the sidebar navigation in the shell', async () => {
    const harness = await RouterTestingHarness.create('/events');
    const links = Array.from(
      harness.fixture.nativeElement.querySelectorAll('nav[aria-label="Main"] a'),
      (a) => (a as HTMLElement).textContent?.trim(),
    );

    expect(links).toEqual(['Overview', 'Events', 'Users', 'Funnels', 'Settings']);
  });

  it.each(['events', 'users', 'funnels', 'settings'])(
    'lazy-loads the %s placeholder and marks its nav link as current',
    async (path) => {
      const harness = await RouterTestingHarness.create(`/${path}`);
      const current = harness.fixture.nativeElement.querySelector('a[aria-current="page"]');

      expect(current?.getAttribute('href')).toBe(`/${path}`);
      expect(harness.routeNativeElement?.textContent).toContain('coming soon');
    },
  );
});
