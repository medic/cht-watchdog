#!/bin/bash
set -e
echo '
    ,    /-.
   ((___/ __>
   /      }      ---- CHT WATCHDOG RESTART SCRIPT ----
   \ .--.(
    \\   \\
'

echo;echo "Killing...";echo
docker compose  \
    -f docker-compose.yml \
    -f exporters/postgres/compose.yml \
    -f development/fake-cht/docker-compose.fake-cht.yml \
    kill

echo;echo "Starting...";echo
docker compose  \
    -f docker-compose.yml \
    -f exporters/postgres/compose.yml \
    -f development/fake-cht/docker-compose.fake-cht.yml \
    up -d \
    --remove-orphans

# shellcheck disable=SC2046
ips=$(docker inspect $(docker ps -q ) \
  --format='{{ printf "%-50s" .Name}} {{range .NetworkSettings.Networks}}{{.IPAddress}} {{end}}'  \
  | tr "\/" " " | tr -s " " )

# shellcheck disable=SC2046
readarray -t ipsArray <<< $(echo -e "${ips}")

final=""
# loop it
for ipLine in "${ipsArray[@]}"; do
  ip=$(echo "$ipLine"  | cut -f3 -d" ")
  name=$(echo "$ipLine"  |cut -f2 -d" ")
  case $name in
    cht-watchdog-extra_sql_exporter-1)
      portPath=":9187/metrics";;
    cht-watchdog-grafana-1)
      portPath=":3000";;
    cht-watchdog-postgres-exporter-1)
      portPath=":9187/metrics";;
    cht-watchdog-json-exporter-1)
      portPath=":7979/metrics";;
    cht-watchdog-prometheus-1) 
      portPath=":9090/targets?search=";;
    cht-watchdog-sql_exporter-1)
      portPath=":9399/metrics";;
    *)
      portPath="";;
  esac
  final+="${name}  http://${ip}${portPath}\n"
done

echo;echo "Services:";echo
echo -e "${final}"  | column -t
echo
