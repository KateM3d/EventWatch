import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeader } from '../../shared/ui/page-header';
import { StateMessage } from '../../shared/ui/state-message';

@Component({
  selector: 'app-users-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, StateMessage],
  template: `
    <app-page-header
      heading="Users"
      description="Understand who your users are and how they engage."
    />
    <app-state-message
      class="card"
      kind="info"
      icon="construction"
      heading="User profiles are coming soon"
      message="Browse individual user timelines, cohorts and retention."
    />
  `,
})
export class UsersPage {}
