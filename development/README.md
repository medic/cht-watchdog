# Developing

This repo has a manual release process where each feature/bug fix will be released immediately after it is merged to `main`:

0. Update QA with the work to be done to ensure they're informed and can guide development
1. Create a ticket for the feature/bug fix.
2. Submit a PR
3. Have the PR reviewed
4. Merge the PR to `main`
5. Following SemVer create either a `N.X.X` (eg Major `1.x.x`), `N.N.X` (eg Minor `1.1.x`) or `N.N.N.X` (eg Patch `1.1.1.x`) branch.  Push this branch to repo.
6. Create a [new release](https://github.com/medic/cht-monitoring/releases/new) being sure to specify the Target branch (eg `1.1.x`) and set the correct release (eg `1.1.0`) and release notes.  Here's an example of releasing a fictitious `1.1.0` release:

   ![Screenshot showing GitHub "Create new Release" page in this repo](./release.png)
7. Close the ticket

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
1
```
docker compose -f docker-compose.yml -f development/fake-cht/docker-compose.fake-cht.yml up -d
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
