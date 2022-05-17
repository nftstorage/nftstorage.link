# Config `psql`

```bash
brew install postgres
# find the service file
echo `pg_config --sysconfdir`/pg_service.conf

# create the above path if it doesn't exist and write your aliases in it

[nftstorage.link]
host=db.nftstorage.link
user=postgres
dbname=postgres
port=5432
password=secret-password

[local]
host=localhost
user=postgres
dbname=postgres
port=5432
password=postgres

# then you can
pg_dump service=nftstorage.link -n public -s > dump.sql
psql service=nftstorage.link -f tables.sql
psql service=nftstorage.link -f reset.sql

```

# Local env

```bash
npx supabase init
npx supabase start

psql service=local -f tables.sql
psql service=local -f functions.sql
```
