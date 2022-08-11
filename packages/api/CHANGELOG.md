# Changelog

## 1.0.0 (2022-08-11)


### ⚠ BREAKING CHANGES

* GET /perma-cache/status renamed to /perma-cache/account

### Features

* add range header support ([#141](https://github.com/nftstorage/nftstorage.link/issues/141)) ([1336d21](https://github.com/nftstorage/nftstorage.link/commit/1336d21f324a374c64d4324304cfb25582c68a54))
* api and gateway version endpoint ([#115](https://github.com/nftstorage/nftstorage.link/issues/115)) ([3b5ad1a](https://github.com/nftstorage/nftstorage.link/commit/3b5ad1ac992e0dfd5e4b8d205056ad689e36c02a))
* api get from bucket and worker binding gateway read from gateway api ([#140](https://github.com/nftstorage/nftstorage.link/issues/140)) ([7a83045](https://github.com/nftstorage/nftstorage.link/commit/7a8304596ee97504ccc876a54c13122da86853f8))
* api metrics ([#88](https://github.com/nftstorage/nftstorage.link/issues/88)) ([ef21449](https://github.com/nftstorage/nftstorage.link/commit/ef2144975d6055d62145d72bd1e5522bedd7751f))
* client perma cache ([#127](https://github.com/nftstorage/nftstorage.link/issues/127)) ([f426b08](https://github.com/nftstorage/nftstorage.link/commit/f426b08ca5232cb0d4b18836bd2afaf4326beedf))
* edge gateway extend cdn resolution with r2 ([#61](https://github.com/nftstorage/nftstorage.link/issues/61)) ([fb78202](https://github.com/nftstorage/nftstorage.link/commit/fb78202a38d11ad81016136c6847253233fd798b))
* http perma cache delete ([#72](https://github.com/nftstorage/nftstorage.link/issues/72)) ([321381a](https://github.com/nftstorage/nftstorage.link/commit/321381ab0c1c0f18860cf912acd295d39947262f))
* http perma cache get ([#65](https://github.com/nftstorage/nftstorage.link/issues/65)) ([df3318e](https://github.com/nftstorage/nftstorage.link/commit/df3318e7f06ac47f958c97088970da50c439d8f7))
* http perma cache post ([#28](https://github.com/nftstorage/nftstorage.link/issues/28)) ([df4dce4](https://github.com/nftstorage/nftstorage.link/commit/df4dce47070fa4d24b088562fe8f62be028d5a66))
* http perma cache status get ([#70](https://github.com/nftstorage/nftstorage.link/issues/70)) ([271bd85](https://github.com/nftstorage/nftstorage.link/commit/271bd85a89c425275c3da692e9c0f63522875cc6))
* postgres for api permacache ([#86](https://github.com/nftstorage/nftstorage.link/issues/86)) ([03f7297](https://github.com/nftstorage/nftstorage.link/commit/03f72971b000ed3cf27a08f36540377ac90fe3b3))
* superhot support for w3s.link read ([#165](https://github.com/nftstorage/nftstorage.link/issues/165)) ([533e7e1](https://github.com/nftstorage/nftstorage.link/commit/533e7e1e1826534c84c11c2a3d98cd180d1c30d9))
* use worker bindings interacting from api to gateway ([#136](https://github.com/nftstorage/nftstorage.link/issues/136)) ([80de324](https://github.com/nftstorage/nftstorage.link/commit/80de3240162abc5ca51c1acb8dd3b7a312c25867))


### Bug Fixes

* add new user tag to type from nft.storage ([#142](https://github.com/nftstorage/nftstorage.link/issues/142)) ([fbd8b85](https://github.com/nftstorage/nftstorage.link/commit/fbd8b8592a60dba0bee2569c5d763a38932bc9b5))
* add no bundle for sentry stack traces ([923b50d](https://github.com/nftstorage/nftstorage.link/commit/923b50d5ea18786c8624a5021a6c2812a7aeda0e))
* api docker project name not valid in new docker version ([7492b64](https://github.com/nftstorage/nftstorage.link/commit/7492b64fd59c24f6245b911b5bc395cd1fd85b29))
* api permacache post always read and write ([#97](https://github.com/nftstorage/nftstorage.link/issues/97)) ([501e59f](https://github.com/nftstorage/nftstorage.link/commit/501e59f92db4409482bf929d381ea47d6993f7a2))
* api permacache validate content length header ([#98](https://github.com/nftstorage/nftstorage.link/issues/98)) ([e28d2c0](https://github.com/nftstorage/nftstorage.link/commit/e28d2c02e30f770452de813cc6b62e11a14b72a9))
* api sentry project name ([#82](https://github.com/nftstorage/nftstorage.link/issues/82)) ([a0a24cb](https://github.com/nftstorage/nftstorage.link/commit/a0a24cbe953d629b8159ec6144174bfb395ed7d5))
* compatibility flag r2_public_beta_bindings not needed anymore ([f3e107c](https://github.com/nftstorage/nftstorage.link/commit/f3e107c433203804a619edb89a398ff4f5fef54a))
* env var gateway domains ([0349690](https://github.com/nftstorage/nftstorage.link/commit/03496903feb35e59422f75e55211c9431b2186be))
* handle invalid range ([#169](https://github.com/nftstorage/nftstorage.link/issues/169)) ([89adb79](https://github.com/nftstorage/nftstorage.link/commit/89adb792fcb668dfc0e5175bccee579d04e59656))
* integrate edge gateway in api until workers bindings available ([#53](https://github.com/nftstorage/nftstorage.link/issues/53)) ([de8d45d](https://github.com/nftstorage/nftstorage.link/commit/de8d45d707758ceb0184eff0c0b1c46e4a2c1427))
* perma cache delete multiple common urls ([#96](https://github.com/nftstorage/nftstorage.link/issues/96)) ([1013d6c](https://github.com/nftstorage/nftstorage.link/commit/1013d6cdc07aca9a6645d3f8b18bbe3b78abab65))
* upgrade wrangler ([#128](https://github.com/nftstorage/nftstorage.link/issues/128)) ([1b11044](https://github.com/nftstorage/nftstorage.link/commit/1b11044b00f40a32126a2a1d04fc27ab929bd412))
* wrap r2 get call with try catch ([784bfbd](https://github.com/nftstorage/nftstorage.link/commit/784bfbd63728aa2f07f52a633d3f1cacdcc94382))

## [2.3.2](https://github.com/nftstorage/nftstorage.link/compare/api-v2.3.1...api-v2.3.2) (2022-08-11)


### Bug Fixes

* handle invalid range ([#169](https://github.com/nftstorage/nftstorage.link/issues/169)) ([89adb79](https://github.com/nftstorage/nftstorage.link/commit/89adb792fcb668dfc0e5175bccee579d04e59656))

## [2.3.1](https://github.com/nftstorage/nftstorage.link/compare/api-v2.3.0...api-v2.3.1) (2022-08-08)


### Bug Fixes

* add no bundle for sentry stack traces ([923b50d](https://github.com/nftstorage/nftstorage.link/commit/923b50d5ea18786c8624a5021a6c2812a7aeda0e))
* env var gateway domains ([0349690](https://github.com/nftstorage/nftstorage.link/commit/03496903feb35e59422f75e55211c9431b2186be))

## [2.3.0](https://github.com/nftstorage/nftstorage.link/compare/api-v2.2.0...api-v2.3.0) (2022-08-08)


### Features

* superhot support for w3s.link read ([#165](https://github.com/nftstorage/nftstorage.link/issues/165)) ([533e7e1](https://github.com/nftstorage/nftstorage.link/commit/533e7e1e1826534c84c11c2a3d98cd180d1c30d9))

## [2.2.0](https://github.com/nftstorage/nftstorage.link/compare/api-v2.1.1...api-v2.2.0) (2022-07-25)


### Features

* add range header support ([#141](https://github.com/nftstorage/nftstorage.link/issues/141)) ([1336d21](https://github.com/nftstorage/nftstorage.link/commit/1336d21f324a374c64d4324304cfb25582c68a54))

## [2.1.1](https://github.com/nftstorage/nftstorage.link/compare/api-v2.1.0...api-v2.1.1) (2022-07-07)


### Bug Fixes

* wrap r2 get call with try catch ([784bfbd](https://github.com/nftstorage/nftstorage.link/commit/784bfbd63728aa2f07f52a633d3f1cacdcc94382))

## [2.1.0](https://github.com/nftstorage/nftstorage.link/compare/api-v2.0.0...api-v2.1.0) (2022-07-06)


### Features

* api get from bucket and worker binding gateway read from gateway api ([#140](https://github.com/nftstorage/nftstorage.link/issues/140)) ([7a83045](https://github.com/nftstorage/nftstorage.link/commit/7a8304596ee97504ccc876a54c13122da86853f8))
* use worker bindings interacting from api to gateway ([#136](https://github.com/nftstorage/nftstorage.link/issues/136)) ([80de324](https://github.com/nftstorage/nftstorage.link/commit/80de3240162abc5ca51c1acb8dd3b7a312c25867))

## [2.0.0](https://github.com/nftstorage/nftstorage.link/compare/api-v1.1.1...api-v2.0.0) (2022-06-10)


### ⚠ BREAKING CHANGES

* GET /perma-cache/status renamed to /perma-cache/account

### Features

* client perma cache ([#127](https://github.com/nftstorage/nftstorage.link/issues/127)) ([f426b08](https://github.com/nftstorage/nftstorage.link/commit/f426b08ca5232cb0d4b18836bd2afaf4326beedf))


### Bug Fixes

* add new user tag to type from nft.storage ([#142](https://github.com/nftstorage/nftstorage.link/issues/142)) ([fbd8b85](https://github.com/nftstorage/nftstorage.link/commit/fbd8b8592a60dba0bee2569c5d763a38932bc9b5))

### [1.1.1](https://github.com/nftstorage/nftstorage.link/compare/api-v1.1.0...api-v1.1.1) (2022-06-01)


### Bug Fixes

* upgrade wrangler ([#128](https://github.com/nftstorage/nftstorage.link/issues/128)) ([1b11044](https://github.com/nftstorage/nftstorage.link/commit/1b11044b00f40a32126a2a1d04fc27ab929bd412))

## [1.1.0](https://github.com/nftstorage/nftstorage.link/compare/api-v1.0.0...api-v1.1.0) (2022-05-28)


### Features

* api and gateway version endpoint ([#115](https://github.com/nftstorage/nftstorage.link/issues/115)) ([3b5ad1a](https://github.com/nftstorage/nftstorage.link/commit/3b5ad1ac992e0dfd5e4b8d205056ad689e36c02a))


### Bug Fixes

* api docker project name not valid in new docker version ([7492b64](https://github.com/nftstorage/nftstorage.link/commit/7492b64fd59c24f6245b911b5bc395cd1fd85b29))

## 1.0.0 (2022-05-23)


### Features

* api metrics ([#88](https://github.com/nftstorage/nftstorage.link/issues/88)) ([ef21449](https://github.com/nftstorage/nftstorage.link/commit/ef2144975d6055d62145d72bd1e5522bedd7751f))
* edge gateway extend cdn resolution with r2 ([#61](https://github.com/nftstorage/nftstorage.link/issues/61)) ([fb78202](https://github.com/nftstorage/nftstorage.link/commit/fb78202a38d11ad81016136c6847253233fd798b))
* http perma cache delete ([#72](https://github.com/nftstorage/nftstorage.link/issues/72)) ([321381a](https://github.com/nftstorage/nftstorage.link/commit/321381ab0c1c0f18860cf912acd295d39947262f))
* http perma cache get ([#65](https://github.com/nftstorage/nftstorage.link/issues/65)) ([df3318e](https://github.com/nftstorage/nftstorage.link/commit/df3318e7f06ac47f958c97088970da50c439d8f7))
* http perma cache post ([#28](https://github.com/nftstorage/nftstorage.link/issues/28)) ([df4dce4](https://github.com/nftstorage/nftstorage.link/commit/df4dce47070fa4d24b088562fe8f62be028d5a66))
* http perma cache status get ([#70](https://github.com/nftstorage/nftstorage.link/issues/70)) ([271bd85](https://github.com/nftstorage/nftstorage.link/commit/271bd85a89c425275c3da692e9c0f63522875cc6))
* postgres for api permacache ([#86](https://github.com/nftstorage/nftstorage.link/issues/86)) ([03f7297](https://github.com/nftstorage/nftstorage.link/commit/03f72971b000ed3cf27a08f36540377ac90fe3b3))


### Bug Fixes

* api permacache post always read and write ([#97](https://github.com/nftstorage/nftstorage.link/issues/97)) ([501e59f](https://github.com/nftstorage/nftstorage.link/commit/501e59f92db4409482bf929d381ea47d6993f7a2))
* api permacache validate content length header ([#98](https://github.com/nftstorage/nftstorage.link/issues/98)) ([e28d2c0](https://github.com/nftstorage/nftstorage.link/commit/e28d2c02e30f770452de813cc6b62e11a14b72a9))
* api sentry project name ([#82](https://github.com/nftstorage/nftstorage.link/issues/82)) ([a0a24cb](https://github.com/nftstorage/nftstorage.link/commit/a0a24cbe953d629b8159ec6144174bfb395ed7d5))
* compatibility flag r2_public_beta_bindings not needed anymore ([f3e107c](https://github.com/nftstorage/nftstorage.link/commit/f3e107c433203804a619edb89a398ff4f5fef54a))
* integrate edge gateway in api until workers bindings available ([#53](https://github.com/nftstorage/nftstorage.link/issues/53)) ([de8d45d](https://github.com/nftstorage/nftstorage.link/commit/de8d45d707758ceb0184eff0c0b1c46e4a2c1427))
* perma cache delete multiple common urls ([#96](https://github.com/nftstorage/nftstorage.link/issues/96)) ([1013d6c](https://github.com/nftstorage/nftstorage.link/commit/1013d6cdc07aca9a6645d3f8b18bbe3b78abab65))
