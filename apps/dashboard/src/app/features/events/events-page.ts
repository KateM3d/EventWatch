import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeader } from '../../shared/ui/page-header';
import { StateMessage } from '../../shared/ui/state-message';

@Component({
  selector: 'app-events-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, StateMessage],
  template: `
    <app-page-header
      heading="Events"
      description="Explore every tracked event and its properties."
    />
    <app-state-message
      class="card"
      kind="info"
      icon="construction"
      heading="Event explorer is coming soon"
      message="Search, filter and break down raw events by property."
    />
  `,
})
export class EventsPage {}
