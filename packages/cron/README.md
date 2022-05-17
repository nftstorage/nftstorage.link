<h1 align="center">⁂<br/>nftstorage.link</h1>
<p align="center">The cron jobs for housekeeping ✨</p>

## Getting started

Ensure you have all the dependencies, by running `pnpm i` in the root project.

The following jobs are available:

### metrics

Verify that the following are set in the `.env` file in root of the project monorepo.

```ini
ENV=dev

DATABASE_URL=http://localhost:3000
DATABASE_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTYwMzk2ODgzNCwiZXhwIjoyNTUwNjUzNjM0LCJyb2xlIjoic2VydmljZV9yb2xlIn0.necIJaiP7X2T2QjGeV-FhpkizcNTX8HjDDBAxpgQTEI
DATABASE_CONNECTION=postgres://postgres:postgres@127.0.0.1:5432/postgres
```

Run the job:

```sh
npm run start:metrics
```
