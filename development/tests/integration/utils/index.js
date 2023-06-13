let testInstance;

const getTestInstance = () => {
  if (!testInstance) {
    testInstance = `test-instance-${Date.now()}`;
  }
  return testInstance;
};

const resetTestInstance = () => testInstance = null;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

module.exports = {
  getTestInstance,
  resetTestInstance,
  sleep
};
