import { Injectable } from '@angular/core';
import { Observable, defer, delay, of, throwError } from 'rxjs';

import { DateRange, OverviewData, Project } from '../models/analytics.models';
import { MOCK_PROJECTS, buildOverview } from './mock-data';

const SIMULATED_LATENCY_MS = 450;

/**
 * Typed analytics API backed by deterministic mock data.
 * The public signatures mirror the future HTTP API so callers will not change.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsApi {
  getProjects(): Observable<readonly Project[]> {
    return of(MOCK_PROJECTS).pipe(delay(SIMULATED_LATENCY_MS));
  }

  getOverview(projectId: string, range: DateRange): Observable<OverviewData> {
    return defer(() => {
      if (!MOCK_PROJECTS.some((p) => p.id === projectId)) {
        return throwError(() => new Error(`Project "${projectId}" was not found.`));
      }
      return of(buildOverview(projectId, range));
    }).pipe(delay(SIMULATED_LATENCY_MS));
  }
}
