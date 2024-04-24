const { copyIfNotExists, createDirIfNotExists } = require('./files');
const { ROOT_PATH } = require('./constants');

const createDataDirs = async () => {
  await createDirIfNotExists(`${ROOT_PATH}/prometheus/data`);
  await createDirIfNotExists(`${ROOT_PATH}/grafana/data`);
};

const initConfigFiles = async () => {
  await copyIfNotExists(
    `${ROOT_PATH}/development/fake-cht/example-config/cht-instances.yml`,
    `${ROOT_PATH}/cht-instances.yml`
  );
  await copyIfNotExists(
    `${ROOT_PATH}/development/fake-cht/example-config/sql_servers.yml`,
    `${ROOT_PATH}/exporters/postgres/sql_servers.yml`
  );
  await copyIfNotExists(
    `${ROOT_PATH}/grafana/grafana.example.ini`,
    `${ROOT_PATH}/grafana/grafana.ini`
  );
};

module.exports = {
  createDataDirs,
  initConfigFiles,
};
