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

### Deploy

Run the following commands to clone this repository and initialize your `.env` file:

```sh
git clone https://github.com/jkuester/cht-monitoring.git
cd cht-monitoring
cp .env.example .env
```

Open the new `.env` file in a text editor and set your desired configuration values.

Run the following command to deploy the stack:

```sh
docker-compose up -d
```

## Using

Grafana is available at `http://localhost:3000` by default. You can log in with your configured admin username and password (`medic`:`password` by default).
