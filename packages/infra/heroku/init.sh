# Generate an API key at https://dashboard.heroku.com/account/applications
# Use your usual email address and API key for password.
heroku login --interactive

# PostgreSQL ###################################################################

# Create empty apps for staging and production
heroku apps:create nft-link-staging --team=web3-storage
heroku apps:create nft-link-prod --team=web3-storage

# Add PostgreSQL databases
heroku addons:create heroku-postgresql:standard-0 --app=nft-link-staging --name=nft-link-staging-0
heroku addons:create heroku-postgresql:premium-0 --app=nft-link-prod --name=nft-link-prod-0

# Add replica
heroku addons:create heroku-postgresql:premium-0 --app=nft-link-prod --name=nft-link-replica-0 --follow $(heroku config:get DATABASE_URL --app=nft-link-prod)

# Add schema
heroku pg:psql nft-link-staging-0 --app=nft-link-staging
# ...run schema SQL from /packages/api/db/config.sql
# ...run schema SQL from /packages/api/db/tables.sql
# ...run schema SQL from /packages/api/db/fdw.sql with credentials replaced
# ...run schema SQL from /packages/api/db/nftstorage.sql
# ...run schema SQL from /packages/api/db/functions.sql
heroku pg:psql nft-link-prod-0 --app=nft-link-prod
# ...run schema SQL from /packages/api/db/config.sql
# ...run schema SQL from /packages/api/db/tables.sql
# ...run schema SQL from /packages/api/db/fdw.sql with credentials replaced
# ...run schema SQL from /packages/api/db/nftstorage.sql
# ...run schema SQL from /packages/api/db/functions.sql

# PostgREST ####################################################################

# Create PostgREST staging and production apps and connect them to staging/production DBs
# https://elements.heroku.com/buildpacks/postgrest/postgrest-heroku
# (App name has 30 char limit)
heroku buildpacks:set https://github.com/hugomrdias/postgrest-heroku -a nft-link-staging
heroku buildpacks:set https://github.com/hugomrdias/postgrest-heroku -a nft-link-prod

# Bump dyno sizes
heroku dyno:resize web=standard-1x --app nft-link-staging
heroku dyno:resize web=standard-2x --app nft-link-prod

# Create the web_anon, authenticator and nft_link credentials
# (Heroku does not allow this to be done in the DB)
# Note that by default the created credential has NO PRIVILEGES
heroku pg:credentials:create nft-link-staging-0 --name=web_anon --app=nft-link-staging
heroku pg:credentials:create nft-link-staging-0 --name=authenticator --app=nft-link-staging
heroku pg:credentials:create nft-link-staging-0 --name=nft_link --app=nft-link-staging

heroku pg:credentials:create nft-link-prod-0 --name=web_anon --app=nft-link-prod
heroku pg:credentials:create nft-link-prod-0 --name=authenticator --app=nft-link-prod
heroku pg:credentials:create nft-link-prod-0 --name=nft_link --app=nft-link-prod

# Grant privileges to PostgREST DB users
# https://postgrest.org/en/stable/tutorials/tut0.html
# https://postgrest.org/en/stable/tutorials/tut1.html
heroku pg:psql nft-link-staging-0 --app=nft-link-staging < grant-postgrest.sql
heroku pg:psql nft-link-prod-0 --app=nft-link-prod < grant-postgrest.sql

# PGREST config vars
heroku config:set DB_ANON_ROLE=web_anon --app=nft-link-prod
heroku config:set DB_POOL=450 --app=nft-link-prod
heroku config:set DB_SCHEMA=public --app=nft-link-prod
heroku config:set JWT_SECRET=secret --app=nft-link-prod # Obtain secret from 1password vault!
heroku config:set POSTGREST_VER=9.0.0 --app=nft-link-prod

heroku config:set DB_ANON_ROLE=web_anon --app=nft-link-staging
heroku config:set DB_POOL=450 --app=nft-link-staging
heroku config:set DB_SCHEMA=public --app=nft-link-staging
heroku config:set JWT_SECRET=secret --app=nft-link-staging # Obtain secret from 1password vault!
heroku config:set POSTGREST_VER=9.0.0 --app=nft-link-staging

# Deploy
cd postgrest/
git init
git add -A
git commit -m "chore: configure postgrest"

heroku git:remote --app=nft-link-staging --remote staging
git push staging main
heroku git:remote --app=nft-link-prod
git push heroku main
# go back to heroku directory
cd ..

# Custom domains
heroku domains:add db-staging.nftstorage.link --app=nft-link-staging
heroku domains:add db.nftstorage.link --app=nft-link-prod
# DNS records need to be added to cloudflare with the returned DNS target

# SSL certs
heroku certs:auto:enable --app=nft-link-staging
heroku certs:auto:enable --app=nft-link-prod

# stats ########################################################################

# Add stats user for ad-hoc reporting (only needs production access)
heroku pg:credentials:create nft-link-prod-0 --name=stats --app=nft-link-prod

# Grant RO privileges to stats user
heroku pg:psql nft-link-prod-0 --app=nft-link-prod < grant-stats.sql
