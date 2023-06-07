const childProcess = require('child_process');
const { ROOT_PATH } = require('./constants.js');

const exec = command => new Promise((resolve, reject) => {
  childProcess.exec(command, (err, stout, sterr) => {
    if(err) {
      reject(sterr);
    } else {
      resolve(stout);
    }
  });
});

const startWatchdog = async () => {
  await exec(`docker compose \
    -f ${ROOT_PATH}/docker-compose.yml \
    -f ${ROOT_PATH}/development/docker-compose.test-data.yml \
    -f ${ROOT_PATH}/exporters/postgres/docker-compose.postgres-exporter.yml \
    up -d`);
};

const stopWatchdog = async () => {
  await exec(`docker compose \
    -f ${ROOT_PATH}/docker-compose.yml \
    -f ${ROOT_PATH}/exporters/postgres/docker-compose.postgres-exporter.yml \
    down -v`);
};

const execInContainer = async (containerName, command) => exec(`docker compose exec ${containerName} ${command}`);

const restartContainer = async (containerName) => exec(`docker compose restart ${containerName}`);

module.exports = {
  execInContainer,
  restartContainer,
  startWatchdog,
  stopWatchdog,
};
