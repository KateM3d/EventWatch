import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeader } from '../../shared/ui/page-header';
import { StateMessage } from '../../shared/ui/state-message';

@Component({
  selector: 'app-settings-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, StateMessage],
  template: `
    <app-page-header heading="Settings" description="Manage project configuration and API keys." />
    <app-state-message
      class="card"
      kind="info"
      icon="construction"
      heading="Settings are coming soon"
      message="Configure projects, team members and data retention."
    />
  `,
})
export class SettingsPage {}
