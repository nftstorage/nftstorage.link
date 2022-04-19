# Wrangler overrides
DEBUG=true

# API Secrets
# the salt is literally secret, not a random string, just 'secret'
SALT=secret

LOGTAIL_TOKEN=secret

## API Sentry
SENTRY_DSN=https://000000@0000000.ingest.sentry.io/00000
SENTRY_TOKEN=secret
SENTRY_UPLOAD=false

## API PostgREST
DATABASE_URL=http://localhost:3000
DATABASE_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTYwMzk2ODgzNCwiZXhwIjoyNTUwNjUzNjM0LCJyb2xlIjoic2VydmljZV9yb2xlIn0.necIJaiP7X2T2QjGeV-FhpkizcNTX8HjDDBAxpgQTEI

# Postgres Database
DATABASE_CONNECTION=postgresql://postgres:postgres@localhost:5432/postgres
