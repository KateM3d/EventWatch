import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { AnalyticsApi } from './analytics-api';
import { MOCK_PROJECTS, buildOverview } from './mock-data';

describe('AnalyticsApi', () => {
  let api: AnalyticsApi;

  beforeEach(() => {
    vi.useFakeTimers();
    api = TestBed.inject(AnalyticsApi);
  });

  afterEach(() => vi.useRealTimers());

  it('emits the project list after the simulated latency', async () => {
    const result = firstValueFrom(api.getProjects());
    await vi.runAllTimersAsync();

    await expect(result).resolves.toEqual(MOCK_PROJECTS);
  });

  it('emits overview data for a known project', async () => {
    const result = firstValueFrom(api.getOverview('demoshop', '30d'));
    await vi.runAllTimersAsync();

    await expect(result).resolves.toEqual(buildOverview('demoshop', '30d'));
  });

  it('errors for an unknown project', async () => {
    const result = firstValueFrom(api.getOverview('missing', '7d'));
    const assertion = expect(result).rejects.toThrow('Project "missing" was not found.');
    await vi.runAllTimersAsync();

    await assertion;
  });
});
