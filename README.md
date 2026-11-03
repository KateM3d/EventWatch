# EventWatch

EventWatch is a SaaS product analytics platform: track product events, understand active users,
and measure conversion through funnels.

This repository is a monorepo that will hold both the backend and the frontend.

| Path                               | Description                                           | Status             |
| ---------------------------------- | ----------------------------------------------------- | ------------------ |
| [`apps/dashboard`](apps/dashboard) | Angular analytics dashboard (runs on mock data)       | Initial scaffold   |
| `apps/api`                         | Backend API and event ingestion                       | Not yet started    |

Each app is self-contained, with its own `package.json` and lockfile, so they can be built,
tested and deployed independently.

## Getting started

Requires Node.js 22 (see [`.nvmrc`](.nvmrc)) and npm.

```bash
cd apps/dashboard
npm ci
npm start          # http://localhost:4200
```

See [`apps/dashboard/README.md`](apps/dashboard/README.md) for architecture and scripts.

## Continuous integration

[`.github/workflows/dashboard.yml`](.github/workflows/dashboard.yml) runs format check, lint, unit
tests and a production build for every change under `apps/dashboard`.
