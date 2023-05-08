# Developing

## Development process

[//]: # (TODO: update with release steps that explain the commit message format)

This repo has a manual release process where each feature/bug fix will be released immediately after it is merged to `main`:

0. Update QA with the work to be done to ensure they're informed and can guide development
1. Create a ticket for the feature/bug fix.
2. Submit a PR
3. Have the PR reviewed
4. Merge the PR to `main`
6. Create a [new release](https://github.com/medic/cht-monitoring/releases/new) being sure to follow SemVer and set the release notes. This will cause a new tag to be created.
   ![Screenshot showing GitHub "Create new Release" page in this repo](./release.png)
7. Close the ticket

## Development patches

When testing updates to this repository, it is useful to be able to iterate quickly.  The default configuration values set for the metric collection time intervals are intended for production usage and are not suitable for testing/development. You can use the `apply-dev-patches` NPM script to apply a set of patches that will lower the interval values to make testing easier.

```shell
npm run apply-dev-patches
```

Just remember that the modified configuration files are being tracked by git, so be sure to revert the patches before committing any changes.

```shell
npm run revert-dev-patches
```

## Adding/modifying Prometheus metrics

Fundamentally, Prometheus stores metrics as a series of time-stamped numerical values associated with a set of labels. String values or other non-numeric values cannot be tracked in Prometheus. See the [Prometheus data model](https://prometheus.io/docs/concepts/data_model/) for more details.

For numerical values, Prometheus supports [four different metric types](https://prometheus.io/docs/concepts/metric_types/).

When adding new metrics, follow the [best practices](https://prometheus.io/docs/practices/naming/) for metric names and labels.

Tips:

- When collecting the same _kind_ of metric for multiple entities, use a single metric name and differentiate the various values using labels. 
    - For example, the `cht_couchdb_doc_total` metric tracks the total number of documents in a CouchDB database. Values for that metric are recorded with a `db` label that specifies which database (e.g. `medic` or `sentinel`) is associated with the value.
- Use a consistent prefix for metric names. This makes it easier to find related metrics.
    - For example, all CHT metrics start with `cht_`.
- Prefer collecting "total" values over collecting "time-bound" values. For example, when recording the number of outbound messages, the value stored should just be the total number of messages sent up to that time. Do not store values like "the number of messages sent in the last 7 days". If Prometheus records the changes to the total number of messages over time, then queries can be used to calculate the number of messages sent in the last 7 days (or any other time range).
- In general, configuration for a Prometheus metric should not be modified after it is created. Any changes to an existing metric could affect data that has already been collected for that metric. If a change is needed, create a new metric with the new configuration and deprecate the old metric. This allows for a clean transition from the old metric to the new metric.

### Adding a new metric from CHT /monitoring API

Metrics loaded from the CHT `/monitoring` endpoint are configured via the json-exporter's [`config.yml`](../exporters/json/config/cht.yml) file. The `modules.default.metrics` section contains the configuration for mapping the JSON response from the CHT `/monitoring` endpoint to Prometheus metrics. New values added to this JSON can be included in Prometheus by adding additional mapping here. See the [json_exporter project](https://github.com/prometheus-community/json_exporter) on GitHub for more information.

### Adding a new metric from a Couch2pg Postgres DB

Metrics loaded from a Couch2pg Postgres DB are configured via the postgres-exporter's [`cht-queries.yml`](../exporters/postgres/config/cht-queries.yml) file. New entries into the file can specify the associated Postgres query for loading the metric data. See the [postgres_exporter project](https://github.com/prometheus-community/postgres_exporter) on GitHub for more information.

### Scraping metrics from a new resource

Configuration for new Prometheus endpoints to scrape can be added in a new directory inside [`exporters`](../exporters). In the new directory, create a `config` directory for any static config files that the consumer should not edit/reference. In this `config` directory, create a `scrape_config.yml` file with the Prometheus scrape configuration for the endpoint.  Then, add a new docker compose `yml` file to your exporter directory. In this file, update the `prometheus` service to include a new `volumes` entry that maps your `scrape_config.yml` file to the Prometheus container in the `/etc/prometheus/scrape_configs` directory.

If you are scraping a resource that natively supports returning Prometheus metrics, this should be all the configuration you need. If your resource does not provide Prometheus metrics, itself, you will need to update the docker compose configuration to include a new exporter container that can convert the resource's metrics into Prometheus metrics.

See the existing exporters for examples.

To start the cht-monitoring services with your new exporter configuration, simply use `-f` to include your new docker compose file when starting the services.

## Adding/modifying Grafana resources

Consumers of cht-monitoring cannot edit the provisioned Grafana configuration (for dashboards and alerts) directly. This means that we can continue to evolve the configuration without worrying about breaking existing deployments. 

### Dashboards

The configuration for provisioned dashboards is stored in [`grafana/provisioning/dashboards/CHT](../grafana/provisioning/dashboards/CHT). Each dashboard is defined in a separate JSON file. The JSON files are generated from the Grafana UI. See the [Grafana documentation](https://grafana.com/docs/grafana/latest/reference/export_import/) for more information.

A new dashboard can be added by simply creating a new JSON file in the `CHT` directory. (The JSON file can be generated from the Grafana UI and then copied into the `CHT` directory.)

Modifications to the existing dashboards can be made directly to the JSON files (if the change is simple) or by using the Grafana UI to make the change and then exporting the updated JSON file.

### Alerts

The configuration for provisioned alert rules is stored in the [`grafana/provisioning/alerting/cht.yml`](../grafana/provisioning/alerting/cht.yml) file. See the [Grafana documentation](https://grafana.com/docs/grafana/latest/alerting/set-up/provision-alerting-resources/file-provisioning/) for more information.

Minor modifications to alert rules can be done directly in the yml file, but any significant additions or modifications to the alert rules should be done in the Grafana UI and then exported via the [Alerting provisioning API](https://grafana.com/docs/grafana/latest/developers/http_api/alerting_provisioning/#route-get-alert-rule-export).

To make significant modifications to an existing alert:

1. View the alert in the Grafana Alert Rules UI, and select the "Copy" button. This will prompt you to create a new rule that "will NOT be marked as provisioned". This is what you want to do.
2. Make your desired changes to your copied rule and save the rule into a new Evaluation group (the details of the group can be anything).
3. View your new rule in the Grafana Alert Rules UI and note the `Rule UID` value.
4. In the Grafana Alert Rules UI, use the "Export" button to download a `yml` file containing the updated configuration.
5. Find the `rules` entry with your `uid` value and diff that with the existing configuration for your rule in the [`grafana/provisioning/alerting/cht.yml`](../grafana/provisioning/alerting/cht.yml) file. Include all the desired changes in the `cht.yml` file, but do not change things like the `uid`, etc. 
6. Delete the copied rule from the Grafana UI.

## Testing during development

Testing Grafana behavior is tricky since it requires data to test. Typically, a Grafana panel/alert will be based on either the latest value from a stream of data or a sequence of historical data values.

### Stream Random Data

The [`fake-cht` server](./fake-cht) can be used to simulate the `/monitoring` endpoint of a CHT instance. It will also populate Couch2pg-style data in a Postgres instance. The data it returns is random (within certain limits).

#### Configure

Copy the example config files:

```shell
cp development/fake-cht/example-config/cht-instances.yml cht-instances.yml
cp development/fake-cht/example-config/postgres* ./exporters/postgres
```

#### Deploy

From the root directory, run:

```shell
docker compose -f docker-compose.yml -f exporters/postgres/docker-compose.postgres-exporter.yml -f development/fake-cht/docker-compose.fake-cht.yml up -d
```

The Postgres data will be persisted in a Docker volume. To clear the data when you are finished testing (to allow for a fresh environment on the next run), run your `docker compose down` command with the `-v` flag to delete the volume.

```shell
docker compose -f docker-compose.yml -f exporters/postgres/docker-compose.postgres-exporter.yml -f development/fake-cht/docker-compose.fake-cht.yml down -v
```

### Historical data

The following is a manual process that involves creating a test data-set and injecting it into a fresh deployment of Prometheus.

Each test is associated with an `xlsx` file in this directory that contains the test data (and a description of the test).

#### Running a test

Start a fresh deployment of cht-monitoring without providing any CHT URL and with the test override:

```
docker compose -f docker-compose.yml -f exporters/postgres/docker-compose.postgres-exporter.yml -f development/fake-cht/docker-compose.fake-cht.yml up -d
```

Open the `xlsx` file of the test you want to run. Switch to the `data` sheet and Save As a `csv` file (named `data.csv`) in the `development` directory.

In your terminal, navigate to the `development` directory and run `cat data.csv | ./generate_test_data.js > ../prometheus/data/data.txt`. This converts the `csv` file to the OpenMetrics format that Prometheus expects and injects it into the Prometheus data volume. _(This is a good point to stop and double-check the `data.txt` file to make sure it looks correct.)_

Run `docker compose exec prometheus promtool tsdb create-blocks-from openmetrics /prometheus/data.txt /prometheus && docker compose restart prometheus` to push the data into Prometheus.

Now you can open Grafana and verify that the panel is displaying the expected data or the expected alert has fired.

Remember, that you have to completely destroy the prometheus data volume before running another test that uses the same metric.

## Email alerts

To test email alerts, we can use a `maildev` server to accept incoming SMTP requests from Grafana.

Update the [`graphana.ini` file](../grafana/grafana.ini) and add the following to the `smtp` section:

```ini
enabled = true
host = maildev:1025
```

Start the `maildev` server along with the rest of the monitoring stack by running `docker compose -f docker-compose.yml -f development/docker-compose.smtp.yml up -d`.

You can view the MailDev UI at http://localhost:1080.
