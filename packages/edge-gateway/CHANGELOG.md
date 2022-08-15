# Changelog

## [1.12.0](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.11.2...edge-gateway-v1.12.0) (2022-08-15)


### Features

* add content security policy header ([#172](https://github.com/nftstorage/nftstorage.link/issues/172)) ([69d0258](https://github.com/nftstorage/nftstorage.link/commit/69d0258a2b33dd61e97936810dc9a9f190c7447e))
* add heartbeat to cron jobs ([#58](https://github.com/nftstorage/nftstorage.link/issues/58)) ([aa42e06](https://github.com/nftstorage/nftstorage.link/commit/aa42e06e06f3903bd2a02d15ba764df55ad1a90c))
* add range header support ([#141](https://github.com/nftstorage/nftstorage.link/issues/141)) ([1336d21](https://github.com/nftstorage/nftstorage.link/commit/1336d21f324a374c64d4324304cfb25582c68a54))
* api and gateway version endpoint ([#115](https://github.com/nftstorage/nftstorage.link/issues/115)) ([3b5ad1a](https://github.com/nftstorage/nftstorage.link/commit/3b5ad1ac992e0dfd5e4b8d205056ad689e36c02a))
* api get from bucket and worker binding gateway read from gateway api ([#140](https://github.com/nftstorage/nftstorage.link/issues/140)) ([7a83045](https://github.com/nftstorage/nftstorage.link/commit/7a8304596ee97504ccc876a54c13122da86853f8))
* edge gateway extend cdn resolution with r2 ([#61](https://github.com/nftstorage/nftstorage.link/issues/61)) ([fb78202](https://github.com/nftstorage/nftstorage.link/commit/fb78202a38d11ad81016136c6847253233fd798b))
* http perma cache post ([#28](https://github.com/nftstorage/nftstorage.link/issues/28)) ([df4dce4](https://github.com/nftstorage/nftstorage.link/commit/df4dce47070fa4d24b088562fe8f62be028d5a66))
* monorepo with gateway ([#4](https://github.com/nftstorage/nftstorage.link/issues/4)) ([3b8bd4f](https://github.com/nftstorage/nftstorage.link/commit/3b8bd4f7d474e23695ca7710a3b9ca65aa9f848f))
* redirect to dweb link when ipns ([#25](https://github.com/nftstorage/nftstorage.link/issues/25)) ([da81710](https://github.com/nftstorage/nftstorage.link/commit/da817101bfb84ee3edda9871f39d36ff13dfa5f9))
* support base cid encodings ([#148](https://github.com/nftstorage/nftstorage.link/issues/148)) ([31ed705](https://github.com/nftstorage/nftstorage.link/commit/31ed70597abe88463569396b1b58b318c410ba80))
* track histogram of race response times ([#79](https://github.com/nftstorage/nftstorage.link/issues/79)) ([7ee39e4](https://github.com/nftstorage/nftstorage.link/commit/7ee39e44a34a27892175c9d469b9b5cc26db8071))


### Bug Fixes

* +inf bucket ([d922927](https://github.com/nftstorage/nftstorage.link/commit/d92292771a8ec5effa6aaddf51be5721b14346df))
* add all routes to edge gateway wrangler file ([1a81e83](https://github.com/nftstorage/nftstorage.link/commit/1a81e8372b30779d6a13551f86489245de6c8f52))
* add four new cids to denylist ([#104](https://github.com/nftstorage/nftstorage.link/issues/104)) ([6dd2c34](https://github.com/nftstorage/nftstorage.link/commit/6dd2c34d60b8d9113cdef54bedb0bc7ce0c54b00))
* add new cid to denylist ([#99](https://github.com/nftstorage/nftstorage.link/issues/99)) ([c973a8f](https://github.com/nftstorage/nftstorage.link/commit/c973a8fff9f84ed51e3de900f180b7171603ba1d))
* add to denylist ([dff2afa](https://github.com/nftstorage/nftstorage.link/commit/dff2afad415f1a0ca56fb64bc4c5671e7511f82a))
* add to denylist 24-05-2022 ([#114](https://github.com/nftstorage/nftstorage.link/issues/114)) ([899e8dc](https://github.com/nftstorage/nftstorage.link/commit/899e8dc8b69342875c1d7ae45ce761d6f09c3da6))
* add two new cids to denylist ([#100](https://github.com/nftstorage/nftstorage.link/issues/100)) ([6819e06](https://github.com/nftstorage/nftstorage.link/commit/6819e06cab4b6386051a20a846b328d4ee0778e7))
* api docker project name not valid in new docker version ([7492b64](https://github.com/nftstorage/nftstorage.link/commit/7492b64fd59c24f6245b911b5bc395cd1fd85b29))
* augment gateway request headers with all headers ([adc41a5](https://github.com/nftstorage/nftstorage.link/commit/adc41a507f5d178b84055f46d582b637731dedd6))
* block bad cids 28-05-2022 ([#125](https://github.com/nftstorage/nftstorage.link/issues/125)) ([ceab1d9](https://github.com/nftstorage/nftstorage.link/commit/ceab1d93b926e6726491bf4e472225c891da0059))
* build env ([#40](https://github.com/nftstorage/nftstorage.link/issues/40)) ([48bc120](https://github.com/nftstorage/nftstorage.link/commit/48bc120affa8eb589334d2c8b1543ae43a437ecc))
* cache match by request only ([#159](https://github.com/nftstorage/nftstorage.link/issues/159)) ([89ed8af](https://github.com/nftstorage/nftstorage.link/commit/89ed8afc6204b3f52bc5cffafee0e05fe14fbf1a))
* check resource cid is in denylist ([#138](https://github.com/nftstorage/nftstorage.link/issues/138)) ([a85d8e9](https://github.com/nftstorage/nftstorage.link/commit/a85d8e9c86fd111e2cad3caec46cc773cef3ba54))
* edge gateway denylist sync no cache request header ([33844e8](https://github.com/nftstorage/nftstorage.link/commit/33844e898526dad35fbb26ac7fa47cb9ab30d204))
* edge gateway routes only ([f3a5bc0](https://github.com/nftstorage/nftstorage.link/commit/f3a5bc0acfc097d0e0987cee3f6a25fbd98806ac))
* gateway get rate limit state function env ([#34](https://github.com/nftstorage/nftstorage.link/issues/34)) ([3fae246](https://github.com/nftstorage/nftstorage.link/commit/3fae246bdea0ec433dbcf1edc6de88dd83a8924f))
* gateway histogram response time only updated on 200 ([#80](https://github.com/nftstorage/nftstorage.link/issues/80)) ([02df16f](https://github.com/nftstorage/nftstorage.link/commit/02df16f9b77dd2e71a575fcca9d857b2412b1c10))
* gateway use cf dns to prevent rate limit instead of durable object ([#36](https://github.com/nftstorage/nftstorage.link/issues/36)) ([f192d70](https://github.com/nftstorage/nftstorage.link/commit/f192d7052e71c6b631b2d86d9a58907e3671186d))
* handle error from prevent rate limit do ([#32](https://github.com/nftstorage/nftstorage.link/issues/32)) ([e1022cc](https://github.com/nftstorage/nftstorage.link/commit/e1022cc02710d23ab96da07700a0776d47601483))
* integrate edge gateway in api until workers bindings available ([#53](https://github.com/nftstorage/nftstorage.link/issues/53)) ([de8d45d](https://github.com/nftstorage/nftstorage.link/commit/de8d45d707758ceb0184eff0c0b1c46e4a2c1427))
* missing built time env vars ([#43](https://github.com/nftstorage/nftstorage.link/issues/43)) ([149aa05](https://github.com/nftstorage/nftstorage.link/commit/149aa05529a692bda623273f2c42089bbecaf3ad))
* prometheus header rename ([#83](https://github.com/nftstorage/nftstorage.link/issues/83)) ([3004d6c](https://github.com/nftstorage/nftstorage.link/commit/3004d6c1b45ae8388c72091995c9f156331b2447))
* remove denylist cli ([#163](https://github.com/nftstorage/nftstorage.link/issues/163)) ([618e8c9](https://github.com/nftstorage/nftstorage.link/commit/618e8c995bc1d3c60267d3695023bd4188182a4d))
* retry gateway denly list kv get ([#50](https://github.com/nftstorage/nftstorage.link/issues/50)) ([3ed087e](https://github.com/nftstorage/nftstorage.link/commit/3ed087e8a1e07fcc9087348bc80b4ca444c42dc2))
* sentry source maps for worker.mjs ([#38](https://github.com/nftstorage/nftstorage.link/issues/38)) ([8100aa3](https://github.com/nftstorage/nftstorage.link/commit/8100aa3cbbd9ed4241247e6774c5ab55548be761))
* sentry stack traces ([#161](https://github.com/nftstorage/nftstorage.link/issues/161)) ([b7e918e](https://github.com/nftstorage/nftstorage.link/commit/b7e918ea423483b2b0e98e64fc8642c1c4a7a64b))
* upgrade wrangler ([#128](https://github.com/nftstorage/nftstorage.link/issues/128)) ([1b11044](https://github.com/nftstorage/nftstorage.link/commit/1b11044b00f40a32126a2a1d04fc27ab929bd412))

## [1.11.2](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.11.1...edge-gateway-v1.11.2) (2022-07-29)


### Bug Fixes

* sentry stack traces ([#161](https://github.com/nftstorage/nftstorage.link/issues/161)) ([b7e918e](https://github.com/nftstorage/nftstorage.link/commit/b7e918ea423483b2b0e98e64fc8642c1c4a7a64b))

## [1.11.1](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.11.0...edge-gateway-v1.11.1) (2022-07-28)


### Bug Fixes

* cache match by request only ([#159](https://github.com/nftstorage/nftstorage.link/issues/159)) ([89ed8af](https://github.com/nftstorage/nftstorage.link/commit/89ed8afc6204b3f52bc5cffafee0e05fe14fbf1a))

## [1.11.0](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.10.0...edge-gateway-v1.11.0) (2022-07-28)


### Features

* support base cid encodings ([#148](https://github.com/nftstorage/nftstorage.link/issues/148)) ([31ed705](https://github.com/nftstorage/nftstorage.link/commit/31ed70597abe88463569396b1b58b318c410ba80))

## [1.10.0](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.9.0...edge-gateway-v1.10.0) (2022-07-25)


### Features

* add range header support ([#141](https://github.com/nftstorage/nftstorage.link/issues/141)) ([1336d21](https://github.com/nftstorage/nftstorage.link/commit/1336d21f324a374c64d4324304cfb25582c68a54))

## [1.9.0](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.8.3...edge-gateway-v1.9.0) (2022-07-06)


### Features

* api get from bucket and worker binding gateway read from gateway api ([#140](https://github.com/nftstorage/nftstorage.link/issues/140)) ([7a83045](https://github.com/nftstorage/nftstorage.link/commit/7a8304596ee97504ccc876a54c13122da86853f8))


### Bug Fixes

* augment gateway request headers with all headers ([adc41a5](https://github.com/nftstorage/nftstorage.link/commit/adc41a507f5d178b84055f46d582b637731dedd6))
* edge gateway denylist sync no cache request header ([33844e8](https://github.com/nftstorage/nftstorage.link/commit/33844e898526dad35fbb26ac7fa47cb9ab30d204))

## [1.8.3](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.8.2...edge-gateway-v1.8.3) (2022-06-08)


### Bug Fixes

* check resource cid is in denylist ([#138](https://github.com/nftstorage/nftstorage.link/issues/138)) ([a85d8e9](https://github.com/nftstorage/nftstorage.link/commit/a85d8e9c86fd111e2cad3caec46cc773cef3ba54))

### [1.8.2](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.8.1...edge-gateway-v1.8.2) (2022-06-01)


### Bug Fixes

* edge gateway routes only ([f3a5bc0](https://github.com/nftstorage/nftstorage.link/commit/f3a5bc0acfc097d0e0987cee3f6a25fbd98806ac))

### [1.8.1](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.8.0...edge-gateway-v1.8.1) (2022-06-01)


### Bug Fixes

* add all routes to edge gateway wrangler file ([1a81e83](https://github.com/nftstorage/nftstorage.link/commit/1a81e8372b30779d6a13551f86489245de6c8f52))
* upgrade wrangler ([#128](https://github.com/nftstorage/nftstorage.link/issues/128)) ([1b11044](https://github.com/nftstorage/nftstorage.link/commit/1b11044b00f40a32126a2a1d04fc27ab929bd412))

## [1.8.0](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.7.0...edge-gateway-v1.8.0) (2022-05-28)


### Features

* api and gateway version endpoint ([#115](https://github.com/nftstorage/nftstorage.link/issues/115)) ([3b5ad1a](https://github.com/nftstorage/nftstorage.link/commit/3b5ad1ac992e0dfd5e4b8d205056ad689e36c02a))


### Bug Fixes

* add four new cids to denylist ([#104](https://github.com/nftstorage/nftstorage.link/issues/104)) ([6dd2c34](https://github.com/nftstorage/nftstorage.link/commit/6dd2c34d60b8d9113cdef54bedb0bc7ce0c54b00))
* add to denylist ([dff2afa](https://github.com/nftstorage/nftstorage.link/commit/dff2afad415f1a0ca56fb64bc4c5671e7511f82a))
* add to denylist 24-05-2022 ([#114](https://github.com/nftstorage/nftstorage.link/issues/114)) ([899e8dc](https://github.com/nftstorage/nftstorage.link/commit/899e8dc8b69342875c1d7ae45ce761d6f09c3da6))
* api docker project name not valid in new docker version ([7492b64](https://github.com/nftstorage/nftstorage.link/commit/7492b64fd59c24f6245b911b5bc395cd1fd85b29))
* block bad cids 28-05-2022 ([#125](https://github.com/nftstorage/nftstorage.link/issues/125)) ([ceab1d9](https://github.com/nftstorage/nftstorage.link/commit/ceab1d93b926e6726491bf4e472225c891da0059))

## [1.7.0](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.6.2...edge-gateway-v1.7.0) (2022-05-20)


### Features

* edge gateway extend cdn resolution with r2 ([#61](https://github.com/nftstorage/nftstorage.link/issues/61)) ([fb78202](https://github.com/nftstorage/nftstorage.link/commit/fb78202a38d11ad81016136c6847253233fd798b))


### Bug Fixes

* add new cid to denylist ([#99](https://github.com/nftstorage/nftstorage.link/issues/99)) ([c973a8f](https://github.com/nftstorage/nftstorage.link/commit/c973a8fff9f84ed51e3de900f180b7171603ba1d))
* add two new cids to denylist ([#100](https://github.com/nftstorage/nftstorage.link/issues/100)) ([6819e06](https://github.com/nftstorage/nftstorage.link/commit/6819e06cab4b6386051a20a846b328d4ee0778e7))
* integrate edge gateway in api until workers bindings available ([#53](https://github.com/nftstorage/nftstorage.link/issues/53)) ([de8d45d](https://github.com/nftstorage/nftstorage.link/commit/de8d45d707758ceb0184eff0c0b1c46e4a2c1427))

### [1.6.2](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.6.1...edge-gateway-v1.6.2) (2022-05-12)


### Bug Fixes

* +inf bucket ([d922927](https://github.com/nftstorage/nftstorage.link/commit/d92292771a8ec5effa6aaddf51be5721b14346df))

### [1.6.1](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.6.0...edge-gateway-v1.6.1) (2022-05-12)


### Bug Fixes

* prometheus header rename ([#83](https://github.com/nftstorage/nftstorage.link/issues/83)) ([3004d6c](https://github.com/nftstorage/nftstorage.link/commit/3004d6c1b45ae8388c72091995c9f156331b2447))

## [1.6.0](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.5.7...edge-gateway-v1.6.0) (2022-05-12)


### Features

* add heartbeat to cron jobs ([#58](https://github.com/nftstorage/nftstorage.link/issues/58)) ([aa42e06](https://github.com/nftstorage/nftstorage.link/commit/aa42e06e06f3903bd2a02d15ba764df55ad1a90c))
* http perma cache post ([#28](https://github.com/nftstorage/nftstorage.link/issues/28)) ([df4dce4](https://github.com/nftstorage/nftstorage.link/commit/df4dce47070fa4d24b088562fe8f62be028d5a66))
* track histogram of race response times ([#79](https://github.com/nftstorage/nftstorage.link/issues/79)) ([7ee39e4](https://github.com/nftstorage/nftstorage.link/commit/7ee39e44a34a27892175c9d469b9b5cc26db8071))


### Bug Fixes

* gateway histogram response time only updated on 200 ([#80](https://github.com/nftstorage/nftstorage.link/issues/80)) ([02df16f](https://github.com/nftstorage/nftstorage.link/commit/02df16f9b77dd2e71a575fcca9d857b2412b1c10))

### [1.5.7](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.5.6...edge-gateway-v1.5.7) (2022-04-25)


### Bug Fixes

* gateway use cf dns to prevent rate limit instead of durable object ([#36](https://github.com/nftstorage/nftstorage.link/issues/36)) ([f192d70](https://github.com/nftstorage/nftstorage.link/commit/f192d7052e71c6b631b2d86d9a58907e3671186d))

### [1.5.6](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.5.5...edge-gateway-v1.5.6) (2022-04-22)


### Bug Fixes

* retry gateway denly list kv get ([#50](https://github.com/nftstorage/nftstorage.link/issues/50)) ([3ed087e](https://github.com/nftstorage/nftstorage.link/commit/3ed087e8a1e07fcc9087348bc80b4ca444c42dc2))

### [1.5.5](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.5.4...edge-gateway-v1.5.5) (2022-04-21)


### Bug Fixes

* missing built time env vars ([#43](https://github.com/nftstorage/nftstorage.link/issues/43)) ([149aa05](https://github.com/nftstorage/nftstorage.link/commit/149aa05529a692bda623273f2c42089bbecaf3ad))

### [1.5.4](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.5.3...edge-gateway-v1.5.4) (2022-04-21)


### Bug Fixes

* build env ([#40](https://github.com/nftstorage/nftstorage.link/issues/40)) ([48bc120](https://github.com/nftstorage/nftstorage.link/commit/48bc120affa8eb589334d2c8b1543ae43a437ecc))

### [1.5.3](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.5.2...edge-gateway-v1.5.3) (2022-04-21)


### Bug Fixes

* sentry source maps for worker.mjs ([#38](https://github.com/nftstorage/nftstorage.link/issues/38)) ([8100aa3](https://github.com/nftstorage/nftstorage.link/commit/8100aa3cbbd9ed4241247e6774c5ab55548be761))

### [1.5.2](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.5.1...edge-gateway-v1.5.2) (2022-04-16)


### Bug Fixes

* gateway get rate limit state function env ([#34](https://github.com/nftstorage/nftstorage.link/issues/34)) ([3fae246](https://github.com/nftstorage/nftstorage.link/commit/3fae246bdea0ec433dbcf1edc6de88dd83a8924f))

### [1.5.1](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.5.0...edge-gateway-v1.5.1) (2022-04-15)


### Bug Fixes

* handle error from prevent rate limit do ([#32](https://github.com/nftstorage/nftstorage.link/issues/32)) ([e1022cc](https://github.com/nftstorage/nftstorage.link/commit/e1022cc02710d23ab96da07700a0776d47601483))

## [1.5.0](https://github.com/nftstorage/nftstorage.link/compare/edge-gateway-v1.4.0...edge-gateway-v1.5.0) (2022-04-13)


### Features

* redirect to dweb link when ipns ([#25](https://github.com/nftstorage/nftstorage.link/issues/25)) ([da81710](https://github.com/nftstorage/nftstorage.link/commit/da817101bfb84ee3edda9871f39d36ff13dfa5f9))

## [1.4.0](https://github.com/nftstorage/nft.storage/compare/gateway-v1.3.1...gateway-v1.4.0) (2022-04-01)


### Features

* gateway deny list ([#1721](https://github.com/nftstorage/nft.storage/issues/1721)) ([b5cecc1](https://github.com/nftstorage/nft.storage/commit/b5cecc1b79bbb3b3a5bfbaf569899f3f7b9e6009))


### Bug Fixes

* check deny list before cache and fix blocked CIDs ([#1748](https://github.com/nftstorage/nft.storage/issues/1748)) ([fbd2922](https://github.com/nftstorage/nft.storage/commit/fbd2922a66d7d82755a3c23c433e16f2abe65880))

### [1.3.1](https://github.com/nftstorage/nft.storage/compare/gateway-v1.3.0...gateway-v1.3.1) (2022-03-17)


### Bug Fixes

* gateway trigger gh actions ([9ed6e36](https://github.com/nftstorage/nft.storage/commit/9ed6e3641bd37d24f41703a4ce7d57998f2c161c))
* use same rate limit prevention do ([#1645](https://github.com/nftstorage/nft.storage/issues/1645)) ([f8c3252](https://github.com/nftstorage/nft.storage/commit/f8c325235745ef664f57912a402289ec869b1ab1))

## [1.3.0](https://github.com/nftstorage/nft.storage/compare/gateway-v1.2.4...gateway-v1.3.0) (2022-03-14)


### Features

* gateway with dedicated cf gateway ([#1546](https://github.com/nftstorage/nft.storage/issues/1546)) ([a3acf00](https://github.com/nftstorage/nft.storage/commit/a3acf00248dd136897b1ccb5f08693f0f74530c3))


### Bug Fixes

* gateway wrangler route ([#1633](https://github.com/nftstorage/nft.storage/issues/1633)) ([b4e9dcc](https://github.com/nftstorage/nft.storage/commit/b4e9dcc497bc01b190cb4e4282665e8a71c9b974))

### [1.2.4](https://github.com/nftstorage/nft.storage/compare/gateway-v1.2.3...gateway-v1.2.4) (2022-03-07)


### Bug Fixes

* gateway ipfs path error on invalid cid ([#1548](https://github.com/nftstorage/nft.storage/issues/1548)) ([6cc7ec8](https://github.com/nftstorage/nft.storage/commit/6cc7ec856fa7ef3db043ff41ecdc5afeb3678ac5))

### [1.2.3](https://github.com/nftstorage/nft.storage/compare/gateway-v1.2.2...gateway-v1.2.3) (2022-03-02)


### Bug Fixes

* gateway directories links resolution ([#1503](https://github.com/nftstorage/nft.storage/issues/1503)) ([65c9517](https://github.com/nftstorage/nft.storage/commit/65c95175d2782d1f5c036fe2f7c6a6c40e294a08))

### [1.2.2](https://github.com/nftstorage/nft.storage/compare/gateway-v1.2.1...gateway-v1.2.2) (2022-03-02)


### Bug Fixes

* gateway ipfs route support for head requests ([#1501](https://github.com/nftstorage/nft.storage/issues/1501)) ([47a4e6c](https://github.com/nftstorage/nft.storage/commit/47a4e6c13e4a40fcafd8e566fde1cbcf6781a714))

### [1.2.1](https://github.com/nftstorage/nft.storage/compare/gateway-v1.2.0...gateway-v1.2.1) (2022-03-01)


### Bug Fixes

* add durable object types ([#1212](https://github.com/nftstorage/nft.storage/issues/1212)) ([ffc9934](https://github.com/nftstorage/nft.storage/commit/ffc9934037795e2e16c816139d336c2bbb83b3c1))
* gateway ipfs path in gateway worker ([#1347](https://github.com/nftstorage/nft.storage/issues/1347)) ([8cf367c](https://github.com/nftstorage/nft.storage/commit/8cf367c885a73f74abe284018556b345738067dc))
* gateway sentry source maps ([#1487](https://github.com/nftstorage/nft.storage/issues/1487)) ([85215c9](https://github.com/nftstorage/nft.storage/commit/85215c96b7c0ef1709e18b41aadfce6ad5229bac))
* update gw architecture diagram with new domain ([#1409](https://github.com/nftstorage/nft.storage/issues/1409)) ([8ca4426](https://github.com/nftstorage/nft.storage/commit/8ca4426988e5c98dfb4125a351a6138e197d6b5e))
* update ipfs car and client ([#1373](https://github.com/nftstorage/nft.storage/issues/1373)) ([2b61549](https://github.com/nftstorage/nft.storage/commit/2b61549f4f31684a6afca28c9f7ed39dc076ada2))

## [1.2.0](https://github.com/nftstorage/nft.storage/compare/gateway-v1.1.2...gateway-v1.2.0) (2022-02-15)


### Features

* gateway known errors render html response ([#1369](https://github.com/nftstorage/nft.storage/issues/1369)) ([2fc0d00](https://github.com/nftstorage/nft.storage/commit/2fc0d00f55b7b6df0ebfde1795f165431f8303a8))

### [1.1.2](https://github.com/nftstorage/nft.storage/compare/gateway-v1.1.1...gateway-v1.1.2) (2022-02-14)


### Bug Fixes

* increase gateway timeout ([#1331](https://github.com/nftstorage/nft.storage/issues/1331)) ([c5f5dee](https://github.com/nftstorage/nft.storage/commit/c5f5dee412c36e7d715943cb7031b9078a79ed7c))

### [1.1.1](https://github.com/nftstorage/nft.storage/compare/gateway-v1.1.0...gateway-v1.1.1) (2022-02-11)


### Bug Fixes

* gateway requested with custom header requested from ([#1344](https://github.com/nftstorage/nft.storage/issues/1344)) ([cf841bb](https://github.com/nftstorage/nft.storage/commit/cf841bbf0c2e24d303dae05f494b1b4fcbc500bd))

## [1.1.0](https://github.com/nftstorage/nft.storage/compare/gateway-v1.0.1...gateway-v1.1.0) (2022-02-09)


### Features

* gateway add support for head request ([#1312](https://github.com/nftstorage/nft.storage/issues/1312)) ([f2faf79](https://github.com/nftstorage/nft.storage/commit/f2faf7936588a4754349f3a578ca822ce03877ef))


### Bug Fixes

* gateway metrics route with cached response ([#1311](https://github.com/nftstorage/nft.storage/issues/1311)) ([7a5a72a](https://github.com/nftstorage/nft.storage/commit/7a5a72aacb216ee71ec2f9439a17ffa59816de21))
* not prevent ipfs io requests ([#1230](https://github.com/nftstorage/nft.storage/issues/1230)) ([769a465](https://github.com/nftstorage/nft.storage/commit/769a4658226656de25f69aae5a8de5066c4d2a26))

### [1.0.1](https://github.com/nftstorage/nft.storage/compare/gateway-v1.0.0...gateway-v1.0.1) (2022-02-08)


### Bug Fixes

* path with file and extension ([#1296](https://github.com/nftstorage/nft.storage/issues/1296)) ([a616623](https://github.com/nftstorage/nft.storage/commit/a616623de9991b01003cad013bdd98e0bd91643e))

## 1.0.0 (2022-02-08)


### Features

* gateway add cloudflare cache layer ([#1180](https://github.com/nftstorage/nft.storage/issues/1180)) ([9fc5e67](https://github.com/nftstorage/nft.storage/commit/9fc5e6780bbe70f5d91095492a5d55c3a250be94))
* gateway logtail integration ([#1037](https://github.com/nftstorage/nft.storage/issues/1037)) ([85a82ff](https://github.com/nftstorage/nft.storage/commit/85a82ff0783399368572c158962618a41081d703))
* gateway rate limiting durable object ([#1178](https://github.com/nftstorage/nft.storage/issues/1178)) ([2b632e2](https://github.com/nftstorage/nft.storage/commit/2b632e2c7daac0f3b75a387a624d131d5ae2d092))
* gateway with x-forwarded-for ip for ipfs.io gateway ([#1227](https://github.com/nftstorage/nft.storage/issues/1227)) ([539813d](https://github.com/nftstorage/nft.storage/commit/539813d7984134fe5518dcfcfe32805f320f2809))
* nft.storage naive gateway implementation ([#908](https://github.com/nftstorage/nft.storage/issues/908)) ([119d948](https://github.com/nftstorage/nft.storage/commit/119d948681da11bcae250f19d8b3eae04e5992b4))
* sentry to gateway ([#919](https://github.com/nftstorage/nft.storage/issues/919)) ([8d544d3](https://github.com/nftstorage/nft.storage/commit/8d544d3bc5d969b2f3a5ef988b0d3c35b1092602))
* track cached response times ([#1232](https://github.com/nftstorage/nft.storage/issues/1232)) ([d4f5951](https://github.com/nftstorage/nft.storage/commit/d4f5951fb41ab8139ddfa72dc0c76a62b8503a5b))
* track content length histogram ([#1206](https://github.com/nftstorage/nft.storage/issues/1206)) ([8723412](https://github.com/nftstorage/nft.storage/commit/8723412b414f9c277854aeb12291f6dfd0692bf1))
* track redirect counts ([#1237](https://github.com/nftstorage/nft.storage/issues/1237)) ([88a9085](https://github.com/nftstorage/nft.storage/commit/88a908592b969207283537c9c339542dd9837b55))
* use multiple gateways and track metrics ([#961](https://github.com/nftstorage/nft.storage/issues/961)) ([24df1f6](https://github.com/nftstorage/nft.storage/commit/24df1f69d481ecb07bdbde237af837a812773e3e))


### Bug Fixes

* gateway get durable object request function ([#1264](https://github.com/nftstorage/nft.storage/issues/1264)) ([3e1795d](https://github.com/nftstorage/nft.storage/commit/3e1795d7f8dc98260bf8c4011def27e2d615eea3))
* gateway get headers record ([#1282](https://github.com/nftstorage/nft.storage/issues/1282)) ([8061714](https://github.com/nftstorage/nft.storage/commit/8061714c1b9a336a9c1fee421215fd41e162639c))
* gateway handle errors ([#1262](https://github.com/nftstorage/nft.storage/issues/1262)) ([cdeed06](https://github.com/nftstorage/nft.storage/commit/cdeed06ef02ccc60c227aa017b243964262a75e8))
* gateway histogram metrics ([#1124](https://github.com/nftstorage/nft.storage/issues/1124)) ([a04a616](https://github.com/nftstorage/nft.storage/commit/a04a616b3c42d5ea83494175cdf19b0cd121d5ab))
* gateway metrics track total winner successful requests ([#1122](https://github.com/nftstorage/nft.storage/issues/1122)) ([1e74ca4](https://github.com/nftstorage/nft.storage/commit/1e74ca477ab71cb37e90620312369321601c890f))
* gateway picture with project name updated ([#1170](https://github.com/nftstorage/nft.storage/issues/1170)) ([c8675e2](https://github.com/nftstorage/nft.storage/commit/c8675e27c429dce165ea741a0c78d4452b494007))
* gateway prometheus metrics best practices naming ([#1194](https://github.com/nftstorage/nft.storage/issues/1194)) ([cfb2616](https://github.com/nftstorage/nft.storage/commit/cfb2616bf9a3ef52ec50fb13b0b0095561dd7bd8))
* logtail to log request start and end ([#1118](https://github.com/nftstorage/nft.storage/issues/1118)) ([70c5afc](https://github.com/nftstorage/nft.storage/commit/70c5afca51dec29b55b1683208601e8839f0361a))
* metrics types ([#1261](https://github.com/nftstorage/nft.storage/issues/1261)) ([a0796bf](https://github.com/nftstorage/nft.storage/commit/a0796bff5647940f939582a9d39115d16f3fbd8f))
* only cache when content length smaller than max object size ([#1197](https://github.com/nftstorage/nft.storage/issues/1197)) ([8907f70](https://github.com/nftstorage/nft.storage/commit/8907f70206339582b5726e845c0cc11a83c0b867))
* prometheus histogram requires upper bound +inf ([#1162](https://github.com/nftstorage/nft.storage/issues/1162)) ([02bb41c](https://github.com/nftstorage/nft.storage/commit/02bb41c8c1b5916d8f16109e4763a1e4b8bc3900))
* properly track errors on winner gateway fetch ([#1133](https://github.com/nftstorage/nft.storage/issues/1133)) ([d989ece](https://github.com/nftstorage/nft.storage/commit/d989ecee7b212357aa88e018796b83c44951697f))
* refactor metrics durable object ([#1112](https://github.com/nftstorage/nft.storage/issues/1112)) ([4eee871](https://github.com/nftstorage/nft.storage/commit/4eee8715cbd22c6ff05ff539ecae98f01cc1c320))
* rename gateway package ([#1114](https://github.com/nftstorage/nft.storage/issues/1114)) ([1ffdced](https://github.com/nftstorage/nft.storage/commit/1ffdced29054a105e9ffc4e03ed200911162c854))
* reset durable objects migrations ([#1233](https://github.com/nftstorage/nft.storage/issues/1233)) ([34f0f75](https://github.com/nftstorage/nft.storage/commit/34f0f7542abc1a4ae2566a149d9453089fd9dbf3))
* reset gateway durable objects migrations ([#1289](https://github.com/nftstorage/nft.storage/issues/1289)) ([dff24ba](https://github.com/nftstorage/nft.storage/commit/dff24ba0ab0540290c16ce5824a9700017ecabe5))
* tweak rate limits per gateway ([#1286](https://github.com/nftstorage/nft.storage/issues/1286)) ([427f025](https://github.com/nftstorage/nft.storage/commit/427f025a9159253dcdbd9fc7d108a93b4ed895d3))
* update gateway miniflare to final version ([#1208](https://github.com/nftstorage/nft.storage/issues/1208)) ([c0b2c3e](https://github.com/nftstorage/nft.storage/commit/c0b2c3e193e3f7a932fd249c125f09508b9b9986))
