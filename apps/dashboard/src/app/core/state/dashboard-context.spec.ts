import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AnalyticsApi } from '../api/analytics-api';
import { MOCK_PROJECTS } from '../api/mock-data';
import { DashboardContext } from './dashboard-context';

describe('DashboardContext', () => {
  let context: DashboardContext;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AnalyticsApi, useValue: { getProjects: () => of(MOCK_PROJECTS) } }],
    });
    context = TestBed.inject(DashboardContext);
  });

  it('defaults to DemoShop production and a 7 day range', () => {
    expect(context.projectId()).toBe('demoshop');
    expect(context.dateRange()).toBe('7d');
    expect(context.project()?.name).toBe('DemoShop');
  });

  it('updates the selected project and date range', () => {
    context.selectProject('demoshop-staging');
    context.selectDateRange('30d');

    expect(context.project()?.environment).toBe('Staging');
    expect(context.dateRange()).toBe('30d');
  });
});
