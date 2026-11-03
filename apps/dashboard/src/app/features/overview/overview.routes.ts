import { Routes } from '@angular/router';
import {
  CategoryScale,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { provideCharts } from 'ng2-charts';

import { OverviewPage } from './overview-page';

export default [
  {
    path: '',
    component: OverviewPage,
    // Registered here rather than app-wide so Chart.js stays out of the initial bundle.
    providers: [
      provideCharts({
        registerables: [
          LineController,
          LineElement,
          PointElement,
          LinearScale,
          CategoryScale,
          Filler,
          Tooltip,
        ],
      }),
    ],
  },
] satisfies Routes;
