import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, Observable, of, throwError } from 'rxjs';

import { AnalyticsApi } from '../../core/api/analytics-api';
import { MOCK_PROJECTS, buildOverview } from '../../core/api/mock-data';
import { DailyActiveUsersPoint, OverviewData } from '../../core/models/analytics.models';
import { DashboardContext } from '../../core/state/dashboard-context';
import { DauChart } from './components/dau-chart';
import { OverviewPage } from './overview-page';

/** jsdom has no canvas implementation, so the Chart.js wrapper is replaced in page tests. */
@Component({ selector: 'app-dau-chart', template: '' })
class DauChartStub {
  readonly points = input.required<DailyActiveUsersPoint[]>();
}

describe('OverviewPage', () => {
  const getOverview = vi.fn<(projectId: string, range: string) => Observable<OverviewData>>();

  /** Set `waitForData` to false when the request never settles, as `whenStable` would hang. */
  async function render({ waitForData = true } = {}) {
    TestBed.configureTestingModule({
      imports: [OverviewPage],
      providers: [
        provideRouter([]),
        { provide: AnalyticsApi, useValue: { getProjects: () => of(MOCK_PROJECTS), getOverview } },
      ],
    }).overrideComponent(OverviewPage, {
      remove: { imports: [DauChart] },
      add: { imports: [DauChartStub] },
    });
    const fixture = TestBed.createComponent(OverviewPage);
    if (waitForData) {
      await fixture.whenStable();
    } else {
      fixture.detectChanges();
    }
    return { fixture, element: fixture.nativeElement as HTMLElement };
  }

  beforeEach(() => getOverview.mockReset());

  it('shows a loading state while data is pending', async () => {
    getOverview.mockReturnValue(NEVER);
    const { element } = await render({ waitForData: false });

    expect(element.querySelector('[data-testid="overview-loading"]')).not.toBeNull();
    expect(element.querySelector('[role="status"]')?.textContent).toContain('Loading overview');
  });

  it('renders KPIs, the funnel and top events once loaded', async () => {
    getOverview.mockReturnValue(of(buildOverview('demoshop', '7d')));
    const { element } = await render();

    const kpiLabels = Array.from(element.querySelectorAll('app-kpi-card'), (card) =>
      card.querySelector('p')?.textContent?.trim(),
    );
    expect(kpiLabels).toEqual(['Active Users', 'Total Events', 'Sessions', 'Conversion']);
    expect(element.querySelectorAll('app-funnel-preview li')).toHaveLength(5);
    expect(element.querySelectorAll('app-top-events-table tbody tr').length).toBeGreaterThan(0);
    expect(element.querySelector('app-dau-chart')).not.toBeNull();
  });

  it('refetches when the date range changes', async () => {
    getOverview.mockReturnValue(of(buildOverview('demoshop', '7d')));
    const { fixture } = await render();

    TestBed.inject(DashboardContext).selectDateRange('30d');
    await fixture.whenStable();

    expect(getOverview).toHaveBeenLastCalledWith('demoshop', '30d');
  });

  it('shows an error state and recovers on retry', async () => {
    getOverview
      .mockReturnValueOnce(throwError(() => new Error('Network down')))
      .mockReturnValue(of(buildOverview('demoshop', '7d')));
    const { fixture, element } = await render();

    const alert = element.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain("We couldn't load the overview");

    alert?.querySelector('button')?.click();
    await fixture.whenStable();

    expect(element.querySelector('[role="alert"]')).toBeNull();
    expect(element.querySelectorAll('app-kpi-card')).toHaveLength(4);
  });

  it('shows an empty state when the project has no data', async () => {
    getOverview.mockReturnValue(of(buildOverview('demoshop-staging', '7d')));
    const { element } = await render();

    expect(element.textContent).toContain('No events tracked yet');
    expect(element.querySelector('app-kpi-card')).toBeNull();
  });
});
