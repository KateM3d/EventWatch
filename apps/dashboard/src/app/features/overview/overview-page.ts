import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { AnalyticsApi } from '../../core/api/analytics-api';
import { DATE_RANGES } from '../../core/models/analytics.models';
import { DashboardContext } from '../../core/state/dashboard-context';
import { PageHeader } from '../../shared/ui/page-header';
import { StateMessage } from '../../shared/ui/state-message';
import { DauChart } from './components/dau-chart';
import { FunnelPreview } from './components/funnel-preview';
import { KpiCard } from './components/kpi-card';
import { TopEventsTable } from './components/top-events-table';

@Component({
  selector: 'app-overview-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, StateMessage, KpiCard, DauChart, TopEventsTable, FunnelPreview],
  templateUrl: './overview-page.html',
})
export class OverviewPage {
  private readonly api = inject(AnalyticsApi);
  private readonly context = inject(DashboardContext);

  /** Refetches whenever the project or date range changes; in-flight requests are cancelled. */
  protected readonly overview = rxResource({
    params: () => ({ projectId: this.context.projectId(), range: this.context.dateRange() }),
    stream: ({ params }) => this.api.getOverview(params.projectId, params.range),
  });

  protected readonly periodLabel = computed(() => {
    const range = this.context.dateRange();
    return DATE_RANGES.find((r) => r.value === range)?.label ?? range;
  });

  protected readonly description = computed(() => {
    const project = this.context.project();
    const scope = project ? `${project.name} · ${project.environment}` : 'Loading project';
    return `${scope} — last ${this.periodLabel()}`;
  });

  protected readonly isEmpty = computed(
    () => this.overview.hasValue() && this.overview.value().dailyActiveUsers.length === 0,
  );
}
