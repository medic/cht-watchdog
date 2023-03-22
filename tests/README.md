# Testing cht-monitoring

## e2e tests

### Grafana dashboard panels

Testing Grafana dashboard panels is tricky since it requires data to test. The following is a manual process that involves creating a test data-set and injecting it into a fresh deployment of Prometheus.

Each test is associated with an `xlsx` file in this directory that contains the test data (and a description of the test).

#### Running a test

Edit the [`docker-compose.yml` file](../docker-compose.yml) and add the following to the `prometheus` service `command` block:

```yaml
    command:
      - '--storage.tsdb.allow-overlapping-blocks'
```

Start a fresh deployment of cht-monitoring without providing any CHT URL.

Open the `xlsx` file of the test you want to run. Switch to the `data` sheet and Save As a `csv` file (named `data.csv`) in the `tests` directory.

In your terminal, navigate to the `tests` directory and run `cat data.csv | ./generate_test_data.js > ../prometheus/data/data.txt`. This converts the `csv` file to the OpenMetrics format that Prometheus expects and injects it into the Prometheus data volume. _(This is a good point to stop and double-check the `data.txt` file to make sure it looks correct.)_

Run `docker compose exec prometheus promtool tsdb create-blocks-from openmetrics /prometheus/data.txt /prometheus && docker compose restart prometheus` to push the data into Prometheus.

Now you can open Grafana and verify that the panel is displaying the expected data.

Remember, that you have to completely destroy the prometheus data volume before running another test that uses the same metric.

### Email alerts

To test email alerts, we can use a `maildev` server to accept incoming SMTP requests from Grafana.

Update the [`graphana.ini` file](../grafana/grafana.ini) and add the following to the `smtp` section:

```ini
enabled = true
host = maildev:1025
```

Start the `maildev` server along with the rest of the monitoring stack by running `docker compose -f docker-compose.yml -f tests/docker-compose.smtp.yml up -d`.
