const { startWatchdog, stopWatchdog } = require('./utils/docker.js');
const { createDataDirs, initConfigFiles } = require('./utils/config');
const { applyPatches, revertPatches } = require('../../patches');
const grafana = require('./utils/grafana');

exports.mochaGlobalSetup = async () => {
  await initConfigFiles();
  await applyPatches();
  await createDataDirs();
  await startWatchdog();
  await grafana.waitUntilStarted();
};

exports.mochaGlobalTeardown = async function () {
  await stopWatchdog();
  await revertPatches();
};
