# cht-monitoring

A monitoring and alerting stack for the CHT built on [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/).

Prometheus records real-time metrics from your CHT instance and stores them in a time series database.

Grafana allows you to visualize the metrics in configurable dashboards.

TODO Alerting!

See the [CHT Documentation](https://docs.communityhealthtoolkit.org/apps/guides/hosting/monitoring/) for more information on monitoring the CHT.

## Deploying

This configuration is designed for deployment with [docker-compose](https://docs.docker.com/compose/).  

### Prerequisites

- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Setup

Run the following commands to clone this repository and initialize your `.env` file:

```sh
git clone https://github.com/medic/cht-monitoring.git
cd cht-monitoring
cp .env.example .env
cp cht-instances.example.yml cht-instances.yml
cp grafana/grafana.example.ini grafana/grafana.ini
```

### Configure

#### Environment Variables

Open the new `.env` file in a text editor and set your desired configuration values.

| Name                        | Default                         | Description                                                                                            |
|-----------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------|
| `GRAFANA_ADMIN_USER`        | `medic`                         | Username for the Grafana admin user                                                                    |
| `GRAFANA_ADMIN_PASSWORD`    | `password`                      | Password for the Grafana admin user                                                                    |
| `GRAFANA_VERSION`           | `latest`                        | Version of the `grafana/grafana-oss` image                                                             |
| `GRAFANA_PORT`              | `3000`                          | Port on the host where Grafana will be available                                                       |
| `GRAFANA_BIND`              | `127.0.0.1`                     | Interface Grafana will bind to.  Change to `0.0.0.0` if you want to expose to all interfaces.  |
| `GRAFANA_DATA`              | `./grafana/data`                | The host directory where Grafana data will be stored                                                   |
| `GRAFANA_PLUGINS`           | `grafana-discourse-datasource`  | Comma separated list of plugins to install (e.g: `grafana-clock-panel,grafana-simple-json-datasource`) |
| `JSON_EXPORTER_VERSION`     | `latest`                        | Version of the `prometheuscommunity/json-exporter` image                                               |
| `PROMETHEUS_VERSION`        | `latest`                        | Version of the `prom/prometheus` image                                                                 |
| `PROMETHEUS_DATA`           | `./prometheus/data`             | The host directory where Prometheus data will be stored                                                |
| `PROMETHEUS_RETENTION_TIME` | `60d`                           | Length of time that Prometheus will store data (e.g. `15d`, `6m`, `1y`)                                |

##### Prometheus Storage

By default, historical monitoring data will be stored in Prometheus (in the `PROMETHEUS_DATA` directory) for 60 days (configurable by `PROMETHEUS_RETENTION_TIME`). A longer retention time can be configured to allow for longer-term analysis of the data.  However, this will increase the size of the Prometheus data volume.  See the [Prometheus documentation](https://prometheus.io/docs/prometheus/latest/storage/) for more information.

Local storage is not suitable for storing large amounts of monitoring data. If you intend to store multiple years worth of metrics, you should consider integrating Prometheus with a [Remote Storage](https://prometheus.io/docs/operating/integrations/#remote-endpoints-and-storage/).

#### Directories

Make sure the directories you have configured for storing Prometheus and Grafana data exist:

```shell
mkdir grafana/data && mkdir prometheus/data 
```

#### CHT Instance(s)

Edit the [`cht-instances.yml` file](./cht-instances.yml) to point to your desired CHT instance(s).

#### Email Alerts

To support sending email alerts from Grafana, you must update the `smtp` section of the [`grafana.ini` file](./grafana/grafana.ini) with your SMTP server configuration.

Specific alerting rules can be set in the Grafana UI.  See the [Grafana Documentation](https://grafana.com/docs/grafana/latest/alerting/) for more information.

### Deploy

Run the following command to deploy the stack:

```sh
docker-compose up -d
```

## Using

Grafana is available at `http://localhost:3000` by default. You can log in with your configured admin username and password (`medic`:`password` by default).

### CHT Metrics

The following CHT metrics are tracked in prometheus:

| OpenMetrics name                      | Type    | label(s)                                          | Description                                                                                                                                                                                                     |
|---------------------------------------|---------|---------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `cht_version`                         | N/A     | `app`, `node`, `couchdb`                          | Version information for the CHT instance (recorded in labels)                                                                                                                                                   |
| `cht_conflict_count`                  | Gauge   |                                                   | Number of doc conflicts which need to be resolved manually.                                                                                                                                                     |
| `cht_connected_users_count`           | Gauge   |                                                   | Number of users that have connected to the api recently. By default the time interval is 7 days. Otherwise it is equal to the connected_user_interval parameter value used when making the /monitoring request. |
| `cht_couchdb_doc_total`               | Counter | `medic`, `sentinel`, `medic-users-meta`, `_users` | The number of docs in the db.                                                                                                                                                                                   |
| `cht_couchdb_doc_del_total`           | Counter | `medic`, `sentinel`, `medic-users-meta`, `_users` | The number of deleted docs in the db.                                                                                                                                                                           |
| `cht_couchdb_fragmentation`           | Gauge   | `medic`, `sentinel`, `medic-users-meta`, `_users` | The fragmentation of the db, lower is better, “1” is no fragmentation.                                                                                                                                          |
| `cht_couchdb_update_sequence`         | Counter | `medic`, `sentinel`, `medic-users-meta`, `_users` | The number of changes in the db.                                                                                                                                                                                |
| `cht_date_current_millis`             | Counter |                                                   | The current server date in millis since the epoch, useful for ensuring the server time is correct.                                                                                                              |
| `cht_date_uptime_seconds`             | Counter |                                                   | How long API has been running.                                                                                                                                                                                  |
| `cht_feedback_total`                  | Counter |                                                   | Number of feedback docs created usually indicative of client side errors.                                                                                                                                       |
| `cht_messaging_outgoing_last_hundred` | Gauge   | `group`, `status`                                 | Counts of last 100 messages that have received status updates.                                                                                                                                                  |
| `cht_messaging_outgoing_total`        | Counter | `status`                                          | Counts of the total number of messages.                                                                                                                                                                         |
| `cht_outbound_push_backlog_count`     | Gauge   |                                                   | Number of changes yet to be processed by Outbound Push.                                                                                                                                                         |
| `cht_replication_limit_count`         | Gauge   |                                                   | Number of users that exceeded the replication limit of documents.                                                                                                                                               |
| `cht_sentinel_backlog_count`          | Gauge   |                                                   | Number of changes yet to be processed by Sentinel.                                                                                                                                                              |


### Grafana Dashboards

Pre-provisioned dashboards are included in the `CHT` folder in the Grafana UI. These should not be updated directly, but can be used as a starting point for creating your own dashboards.

Future updates to this configuration can include additions/updates to the CHT dashboards.

### Alerts

This configuration includes number of pre-provisioned alerts.  See the [Grafana Documentation](https://grafana.com/docs/grafana/latest/alerting/set-up/provision-alerting-resources/file-provisioning/#provision-alert-rules) for more information on how to edit or remove these provisioned alerts.

To receive these alerts by email, you must [configure Grafana's SMTP settings](#email-alerts) and then, in the web interface, add the desired recipient email addresses in the `grafana-default-email` contact point settings.

Future updates to this configuration can include additions/updates to the CHT alerts.

## Monitoring Basics

### Metric types

[Prometheus supports](https://prometheus.io/docs/concepts/metric_types/) four metric types: Counter, Gauge, Histogram, and Summary.  Currently, the CHT only provides Counter and Gauge type metrics.  

### Functions

When building panels for Grafana dashboards, [Prometheus Functions](https://prometheus.io/docs/prometheus/latest/querying/functions/) can be used to manipulate the metric data.  

### Dashboard best practices

Refer to the [Grafana Documentation](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/) for best practices on building dashboards.
