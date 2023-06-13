const { startWatchdog, stopWatchdog } = require('./utils/docker');
const { createDataDirs, initConfigFiles } = require('./utils/config');
const { applyPatches, revertPatches } = require('../../patches');
const grafana = require('./utils/grafana');
const { BUILD_PATH } = require('./utils/constants');
const { createDirIfNotExists } = require('./utils/files');
const { resetTestInstance } = require('./utils');

exports.mochaGlobalSetup = async () => {
  await createDirIfNotExists(BUILD_PATH);
  await initConfigFiles();
  await applyPatches();
  await createDataDirs();
  await startWatchdog();
  await grafana.waitUntilStarted();
};

exports.mochaGlobalTeardown = async () => {
  await stopWatchdog();
  await revertPatches();
};

exports.mochaHooks = {
  afterEach: () => {
    resetTestInstance();
  }
};
