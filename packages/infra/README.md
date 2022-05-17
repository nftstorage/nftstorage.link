# Infra

Scripts for provisioning nftstorage.link infrastructure.

![High level DB Architecture](./nftstorage.link-db-arch.jpg)

# Forking API production database to staging

```bash
heroku addons:create heroku-postgresql:premium-3 --app nft-link-staging --fork nft-link-prod-0 --fast --name=nft-link-staging-0
```
