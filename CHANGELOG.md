# [1.19.0](https://github.com/medic/cht-watchdog/compare/1.18.0...1.19.0) (2025-04-28)


### Features

* **#133:** uplift to Prometheus `3.3.0` ([#147](https://github.com/medic/cht-watchdog/issues/147)) ([439a7dc](https://github.com/medic/cht-watchdog/commit/439a7dc00414c3b83459cc7941df836cfc2c056e)), closes [#133](https://github.com/medic/cht-watchdog/issues/133)

# [1.18.0](https://github.com/medic/cht-watchdog/compare/1.17.0...1.18.0) (2025-03-19)


### Features

* **#144:** additional configuration for cht-user-management ([#146](https://github.com/medic/cht-watchdog/issues/146)) ([8cf360b](https://github.com/medic/cht-watchdog/commit/8cf360b78fdebdaacb1b812bd5455a3907fc19c9)), closes [#144](https://github.com/medic/cht-watchdog/issues/144)

# [1.17.0](https://github.com/medic/cht-watchdog/compare/1.16.0...1.17.0) (2024-10-18)


### Features

* add cht-sync collector and update the sql exporter example ([b31f6b0](https://github.com/medic/cht-watchdog/commit/b31f6b0d1c0ff138763f5aafecd60c2d8c667465))

# [1.16.0](https://github.com/medic/cht-watchdog/compare/1.15.0...1.16.0) (2024-09-18)


### Features

* **#9428:** collect new size metrics from CHT monitoring API ([#114](https://github.com/medic/cht-watchdog/issues/114)) ([b043b5d](https://github.com/medic/cht-watchdog/commit/b043b5dbe2f715adf634739acb0d01f7e5b093e0)), closes [#9428](https://github.com/medic/cht-watchdog/issues/9428)

# [1.15.0](https://github.com/medic/cht-watchdog/compare/1.14.0...1.15.0) (2024-09-18)


### Features

* **#112:** update default service versions ([#113](https://github.com/medic/cht-watchdog/issues/113)) ([e1acda3](https://github.com/medic/cht-watchdog/commit/e1acda367e50e3b8e79b0dee5e8290e2d60d4c9c)), closes [#112](https://github.com/medic/cht-watchdog/issues/112)

# [1.14.0](https://github.com/medic/cht-watchdog/compare/1.13.0...1.14.0) (2024-05-16)


### Features

* **couch-backlog:** multi-couch2pg isntances on 1 db, update fake-cht, add prometheus env vars ([#108](https://github.com/medic/cht-watchdog/issues/108)) ([7bfcbf7](https://github.com/medic/cht-watchdog/commit/7bfcbf7819a4ee82a906109804d110b5a476387b))

# [1.13.0](https://github.com/medic/cht-watchdog/compare/1.12.0...1.13.0) (2024-05-10)


### Features

* **#99:** add  couch2pg exporter compose file to run stand alone without watchdog ([#102](https://github.com/medic/cht-watchdog/issues/102)) ([7817175](https://github.com/medic/cht-watchdog/commit/78171754e619b45318a88a407879fec6c7314f80)), closes [#99](https://github.com/medic/cht-watchdog/issues/99)

# [1.12.0](https://github.com/medic/cht-watchdog/compare/1.11.2...1.12.0) (2024-04-25)


### Features

* **#81:** replace deprecated SQL exporter with non-deprecated one  ([#100](https://github.com/medic/cht-watchdog/issues/100)) ([0d4cb13](https://github.com/medic/cht-watchdog/commit/0d4cb139152c37c6833591944bf75450a1c51676)), closes [#81](https://github.com/medic/cht-watchdog/issues/81) [#81](https://github.com/medic/cht-watchdog/issues/81)

## [1.11.2](https://github.com/medic/cht-watchdog/compare/1.11.1...1.11.2) (2023-09-28)


### Bug Fixes

* **#90:** incorrect cht replication dashboard apdex calculations ([#91](https://github.com/medic/cht-watchdog/issues/91)) ([a46358a](https://github.com/medic/cht-watchdog/commit/a46358a2f15f47293813a189050423bd71d3ff0d)), closes [#90](https://github.com/medic/cht-watchdog/issues/90)

## [1.11.1](https://github.com/medic/cht-watchdog/compare/1.11.0...1.11.1) (2023-09-21)


### Bug Fixes

* **#88:** refresh prometheus datasource in replication dashboard ([#89](https://github.com/medic/cht-watchdog/issues/89)) ([785190c](https://github.com/medic/cht-watchdog/commit/785190c2bdf2fe57c1151f08a86191f5874861e5)), closes [#88](https://github.com/medic/cht-watchdog/issues/88)

# [1.11.0](https://github.com/medic/cht-watchdog/compare/1.10.0...1.11.0) (2023-09-21)


### Features

* **#60:** CHT API Server and CHT Replication dashboards ([#75](https://github.com/medic/cht-watchdog/issues/75)) ([e57487d](https://github.com/medic/cht-watchdog/commit/e57487dad835ab8d5d0fb743240358e2c0482231)), closes [#60](https://github.com/medic/cht-watchdog/issues/60)

# [1.10.0](https://github.com/medic/cht-watchdog/compare/1.9.0...1.10.0) (2023-09-07)


### Features

* **#60:** add prometheus job to scrape express-metrics ([#74](https://github.com/medic/cht-watchdog/issues/74)) ([5ea380c](https://github.com/medic/cht-watchdog/commit/5ea380ceafb6bbf3af34fc6e19f51716f7ae3e26)), closes [#60](https://github.com/medic/cht-watchdog/issues/60)

## [1.8.2](https://github.com/medic/cht-watchdog/compare/1.8.1...1.8.2) (2023-07-28)


### Bug Fixes

* **#70:** disable all non-custom Postgres metrics ([#79](https://github.com/medic/cht-watchdog/issues/79)) ([2dcaea6](https://github.com/medic/cht-watchdog/commit/2dcaea6610d78a5b96766f6f82f7eb9879df8b40)), closes [#70](https://github.com/medic/cht-watchdog/issues/70)

## [1.8.1](https://github.com/medic/cht-watchdog/compare/1.8.0...1.8.1) (2023-06-27)


### Bug Fixes

* **#68:** Defensive couch2pg select ([#71](https://github.com/medic/cht-watchdog/issues/71)) ([ae9c1c4](https://github.com/medic/cht-watchdog/commit/ae9c1c415845d7e815bde5efc0cfa04daa2ad070)), closes [#68](https://github.com/medic/cht-watchdog/issues/68)

# [1.8.0](https://github.com/medic/cht-watchdog/compare/1.7.0...1.8.0) (2023-06-21)


### Features

* **#52:** set dynamic threshold for DB Conflicts Rate alert ([#66](https://github.com/medic/cht-watchdog/issues/66)) ([9fe0798](https://github.com/medic/cht-watchdog/commit/9fe0798f36e6016ec473bc9039556b9d7d4725df)), closes [#52](https://github.com/medic/cht-watchdog/issues/52)

# [1.7.0](https://github.com/medic/cht-watchdog/compare/1.6.0...1.7.0) (2023-06-20)


### Features

* **#52:** set dynamic threshold for Users Over Rep Limit ([#65](https://github.com/medic/cht-watchdog/issues/65)) ([97a3abf](https://github.com/medic/cht-watchdog/commit/97a3abf69e1e0253c66ca3b038e57cc62eed804d)), closes [#52](https://github.com/medic/cht-watchdog/issues/52)

# [1.6.0](https://github.com/medic/cht-watchdog/compare/1.5.2...1.6.0) (2023-06-14)


### Features

* **#52:** set dynamic threshold for Outbound Push Backlog ([#62](https://github.com/medic/cht-watchdog/issues/62)) ([0bcdd55](https://github.com/medic/cht-watchdog/commit/0bcdd552edd5b86bed4236340c4606523c27cd24)), closes [#52](https://github.com/medic/cht-watchdog/issues/52)

## [1.5.2](https://github.com/medic/cht-watchdog/compare/1.5.1...1.5.2) (2023-06-14)


### Bug Fixes

* **#63:** fix Sentinel Backlog panels for multiple CHT instances ([#64](https://github.com/medic/cht-watchdog/issues/64)) ([c6ed722](https://github.com/medic/cht-watchdog/commit/c6ed722410e9844a0bb291e0b511301d32003f8b))

## [1.5.1](https://github.com/medic/cht-watchdog/compare/1.5.0...1.5.1) (2023-06-14)


### Bug Fixes

* **#55:** support postgres <10 ([#59](https://github.com/medic/cht-watchdog/issues/59)) ([612c2d7](https://github.com/medic/cht-watchdog/commit/612c2d7e7c3f1dfabf91bbc7273351985b35776f)), closes [#55](https://github.com/medic/cht-watchdog/issues/55)

# [1.5.0](https://github.com/medic/cht-watchdog/compare/1.4.1...1.5.0) (2023-06-13)


### Features

* **#52:** set dynamic threshold for Sentinel Backlog alert rule ([#58](https://github.com/medic/cht-watchdog/issues/58)) ([d57294b](https://github.com/medic/cht-watchdog/commit/d57294b5195860fa701713d4cc92f3bc28eaba06)), closes [#52](https://github.com/medic/cht-watchdog/issues/52)

## [1.4.1](https://github.com/medic/cht-watchdog/compare/1.4.0...1.4.1) (2023-06-06)


### Bug Fixes

* **#35:** fix DB Fragmentation alert on multi-instance deployments ([#57](https://github.com/medic/cht-watchdog/issues/57)) ([6f89594](https://github.com/medic/cht-watchdog/commit/6f8959416d778e77929006244ed92d0198295859))

# [1.4.0](https://github.com/medic/cht-watchdog/compare/1.3.0...1.4.0) (2023-05-30)


### Features

* **alerts:** reduce sensitivity for API Server Down alert ([#56](https://github.com/medic/cht-watchdog/issues/56)) ([d88ea16](https://github.com/medic/cht-watchdog/commit/d88ea16239329430c39af399a5e9f278348684cf))

# [1.3.0](https://github.com/medic/cht-watchdog/compare/1.2.1...1.3.0) (2023-05-23)


### Features

* **53:** add recommended method for deleting provisioned alerts ([#54](https://github.com/medic/cht-watchdog/issues/54)) ([5971c28](https://github.com/medic/cht-watchdog/commit/5971c281952ff1ca7df8cfaf5215870f0d0a0f6a))

## [1.2.1](https://github.com/medic/cht-monitoring/compare/1.2.0...1.2.1) (2023-05-15)


### Bug Fixes

* **config:** add server url to grafana.example.ini ([#44](https://github.com/medic/cht-monitoring/issues/44)) ([03c0dd2](https://github.com/medic/cht-monitoring/commit/03c0dd23855c8fa57ba67b2f95277e371b47a1a9))

# [1.2.0](https://github.com/medic/cht-monitoring/compare/1.1.0...1.2.0) (2023-05-15)


### Bug Fixes

* **35:** update DB Fragmentation and Message Delivery Rate alerts ([#37](https://github.com/medic/cht-monitoring/issues/37)) ([7e19a10](https://github.com/medic/cht-monitoring/commit/7e19a106408fe90826f907841ae0b5d3bd4acdf1))


### Features

* **#34:** automate releases ([#42](https://github.com/medic/cht-monitoring/issues/42)) ([158ff6e](https://github.com/medic/cht-monitoring/commit/158ff6ec089b3c12440081b718331c1088dff2c1)), closes [#34](https://github.com/medic/cht-monitoring/issues/34) [#34](https://github.com/medic/cht-monitoring/issues/34) [#34](https://github.com/medic/cht-monitoring/issues/34) [#34](https://github.com/medic/cht-monitoring/issues/34) [#34](https://github.com/medic/cht-monitoring/issues/34) [#34](https://github.com/medic/cht-monitoring/issues/34) [#34](https://github.com/medic/cht-monitoring/issues/34) [#34](https://github.com/medic/cht-monitoring/issues/34) [#34](https://github.com/medic/cht-monitoring/issues/34)
* **releases:** fix releases tag format ([#48](https://github.com/medic/cht-monitoring/issues/48)) ([66f07de](https://github.com/medic/cht-monitoring/commit/66f07de0b67c71e4eba652340f1c0ee57932ed6f))

# 1.0.0 (2023-05-11)


### Bug Fixes

* **#20:** update overview panel links to work when in same tab ([#25](https://github.com/medic/cht-monitoring/issues/25)) ([78bd08c](https://github.com/medic/cht-monitoring/commit/78bd08caab9e541c34a0944c8383c21f54fd7361)), closes [#20](https://github.com/medic/cht-monitoring/issues/20)
* **35:** update DB Fragmentation and Message Delivery Rate alerts ([#37](https://github.com/medic/cht-monitoring/issues/37)) ([7e19a10](https://github.com/medic/cht-monitoring/commit/7e19a106408fe90826f907841ae0b5d3bd4acdf1))


### Features

* **#34:** automate releases ([#42](https://github.com/medic/cht-monitoring/issues/42)) ([158ff6e](https://github.com/medic/cht-monitoring/commit/158ff6ec089b3c12440081b718331c1088dff2c1)), closes [#34](https://github.com/medic/cht-monitoring/issues/34) [#34](https://github.com/medic/cht-monitoring/issues/34) [#34](https://github.com/medic/cht-monitoring/issues/34) [#34](https://github.com/medic/cht-monitoring/issues/34) [#34](https://github.com/medic/cht-monitoring/issues/34) [#34](https://github.com/medic/cht-monitoring/issues/34) [#34](https://github.com/medic/cht-monitoring/issues/34) [#34](https://github.com/medic/cht-monitoring/issues/34) [#34](https://github.com/medic/cht-monitoring/issues/34)
* **Grafana:** Update names for Grafana provisioning files ([#18](https://github.com/medic/cht-monitoring/issues/18)) ([01a52d8](https://github.com/medic/cht-monitoring/commit/01a52d8dcecc6292dd5420245a09d24f91b3836e))
* Update config so CHT urls do not need monitoring path ([#21](https://github.com/medic/cht-monitoring/issues/21)) ([d37f352](https://github.com/medic/cht-monitoring/commit/d37f3521cc4e2ed5c6097306076648d5684635fe))
