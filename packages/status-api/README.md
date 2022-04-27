# nftstorage.link status API

Outputs a simple JSON file to the `dist` directory with current status.

## Updating current status

Login to DigitalOcean, find the app and set the `STATUS` environment variable to "ok" (for all OK) or anything else for not ok.

## Infra

Hosted in DigitalOcean with the following app spec:

```yaml
envs:
  - key: STATUS
    scope: RUN_AND_BUILD_TIME
    value: ok
name: nftstorage-link-status-api
region: lon
static_sites:
  - build_command: npm run build
    environment_slug: node-js
    github:
      branch: main
      deploy_on_push: true
      repo: nftstorage/nftstorage.link
    name: nftstorage-link-status-api
    routes:
      - path: /
    source_dir: packages/status-api
    index_document: index.json
    cors:
      allow_origins:
        - exact: '*'
      allow_methods:
        - GET
        - OPTIONS
```

Note: `index_document` and `cors` config are the two additions to the default. See https://docs.digitalocean.com/products/app-platform/references/app-specification-reference/.
