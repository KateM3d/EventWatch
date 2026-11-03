import { Injectable, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { AnalyticsApi } from '../api/analytics-api';
import { DateRange, Project } from '../models/analytics.models';

/** App-wide dashboard selections shared by the header and every feature page. */
@Injectable({ providedIn: 'root' })
export class DashboardContext {
  private readonly api = inject(AnalyticsApi);

  private readonly _projectId = signal('demoshop');
  private readonly _dateRange = signal<DateRange>('7d');

  readonly projects = toSignal(this.api.getProjects(), {
    initialValue: [] as readonly Project[],
  });
  readonly projectId = this._projectId.asReadonly();
  readonly dateRange = this._dateRange.asReadonly();
  readonly project = computed(() => this.projects().find((p) => p.id === this._projectId()));

  selectProject(projectId: string): void {
    this._projectId.set(projectId);
  }

  selectDateRange(range: DateRange): void {
    this._dateRange.set(range);
  }
}
