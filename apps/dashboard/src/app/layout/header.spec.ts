import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AnalyticsApi } from '../core/api/analytics-api';
import { MOCK_PROJECTS } from '../core/api/mock-data';
import { DashboardContext } from '../core/state/dashboard-context';
import { Header } from './header';

describe('Header', () => {
  async function setup() {
    TestBed.configureTestingModule({
      providers: [{ provide: AnalyticsApi, useValue: { getProjects: () => of(MOCK_PROJECTS) } }],
    });
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    return {
      fixture,
      element: fixture.nativeElement as HTMLElement,
      context: TestBed.inject(DashboardContext),
    };
  }

  it('lists projects with DemoShop production selected', async () => {
    const { element } = await setup();
    const select = element.querySelector<HTMLSelectElement>('#project-select');

    expect(select?.options).toHaveLength(MOCK_PROJECTS.length);
    expect(select?.selectedOptions[0]?.textContent?.trim()).toBe('DemoShop · Production');
  });

  it('switches project on selection change', async () => {
    const { element, context } = await setup();
    const select = element.querySelector<HTMLSelectElement>('#project-select');
    if (!select) throw new Error('project select not rendered');

    select.value = 'demoshop-staging';
    select.dispatchEvent(new Event('change'));

    expect(context.projectId()).toBe('demoshop-staging');
  });

  it('switches date range and reflects it via aria-pressed', async () => {
    const { fixture, element, context } = await setup();
    const [sevenDays, thirtyDays] = Array.from(
      element.querySelectorAll<HTMLButtonElement>('[aria-label="Date range"] button'),
    );

    expect(sevenDays?.getAttribute('aria-pressed')).toBe('true');

    thirtyDays?.click();
    await fixture.whenStable();

    expect(context.dateRange()).toBe('30d');
    expect(thirtyDays?.getAttribute('aria-pressed')).toBe('true');
    expect(sevenDays?.getAttribute('aria-pressed')).toBe('false');
  });
});
