const childProcess = require('child_process');
const { ROOT_PATH } = require('./constants.js');
const { applyPatches, revertPatches } = require('../../../patches');
const { copyIfNotExists, createDirIfNotExists } = require('./files.js');
const grafana = require('./grafana');

const exec = command => new Promise((resolve, reject) => {
  childProcess.exec(command, (err, stout, sterr) => {
    if(err) {
      reject(sterr);
    } else {
      resolve(stout);
    }
  });
});

const initConfigFiles = async () => {
  await copyIfNotExists(
    `${ROOT_PATH}/development/fake-cht/example-config/cht-instances.yml`,
    `${ROOT_PATH}/cht-instances.yml`
  );
  await copyIfNotExists(
    `${ROOT_PATH}/development/fake-cht/example-config/postgres-instances.yml`,
    `${ROOT_PATH}/exporters/postgres/postgres-instances.yml`
  );
  await copyIfNotExists(
    `${ROOT_PATH}/development/fake-cht/example-config/postgres_exporter.yml`,
    `${ROOT_PATH}/exporters/postgres/postgres_exporter.yml`
  );
  await copyIfNotExists(
    `${ROOT_PATH}/grafana/grafana.example.ini`,
    `${ROOT_PATH}/grafana/grafana.ini`
  );
};

const createDataDirs = async () => {
  await createDirIfNotExists(`${ROOT_PATH}/prometheus/data`);
  await createDirIfNotExists(`${ROOT_PATH}/grafana/data`);
};

const startWatchdog = async () => {
  await initConfigFiles();
  console.log('done');
  await applyPatches();
  await createDataDirs();
  console.log('upping docker containers');
  await exec(`docker compose \
    -f ${ROOT_PATH}/docker-compose.yml \
    -f ${ROOT_PATH}/development/docker-compose.test-data.yml \
    -f ${ROOT_PATH}/exporters/postgres/docker-compose.postgres-exporter.yml \
    up -d`);
  console.log('waiting for grafana to start');
  await grafana.waitUntilStarted();
};

const stopWatchdog = async () => {
  await exec(`docker compose \
    -f ${ROOT_PATH}/docker-compose.yml \
    -f ${ROOT_PATH}/exporters/postgres/docker-compose.postgres-exporter.yml \
    down -v`);
  await revertPatches();
};

const execInContainer = async (containerName, command) => exec(`docker compose exec ${containerName} ${command}`);

const restartContainer = async (containerName) => exec(`docker compose restart ${containerName}`);

module.exports = {
  execInContainer,
  restartContainer,
  startWatchdog,
  stopWatchdog,
};
