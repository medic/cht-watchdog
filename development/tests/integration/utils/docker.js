const childProcess = require('child_process');
const { ROOT_PATH } = require('./constants');

const exec = require('util').promisify(childProcess.exec);

const startWatchdog = async () => {
  await exec(`docker compose \
    -f ${ROOT_PATH}/docker-compose.yml \
    -f ${ROOT_PATH}/development/docker-compose.test-data.yml \
    -f ${ROOT_PATH}/exporters/postgres/compose.yml \
    up -d`);
};

const stopWatchdog = async () => {
  await exec(`docker compose \
    -f ${ROOT_PATH}/docker-compose.yml \
    -f ${ROOT_PATH}/exporters/postgres/compose.yml \
    down -v`);
};

const execInContainer = async (containerName, command) => exec(`docker compose exec ${containerName} ${command}`);

const restartContainer = async (containerName) => exec(`docker compose restart ${containerName}`);

const copyToContainer = async (containerName, source, destination) => exec(
  `docker compose cp ${source} ${containerName}:${destination}`
);

module.exports = {
  copyToContainer,
  execInContainer,
  restartContainer,
  startWatchdog,
  stopWatchdog,
};
