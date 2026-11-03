import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeader } from '../../shared/ui/page-header';
import { StateMessage } from '../../shared/ui/state-message';

@Component({
  selector: 'app-funnels-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, StateMessage],
  template: `
    <app-page-header heading="Funnels" description="Measure conversion through multi-step flows." />
    <app-state-message
      class="card"
      kind="info"
      icon="construction"
      heading="Funnel builder is coming soon"
      message="Define custom steps and analyse drop-off between them."
    />
  `,
})
export class FunnelsPage {}
