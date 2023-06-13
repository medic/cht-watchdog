const fs = require('fs').promises;

const pathExists = async (path) => fs
  .access(path, fs.constants.F_OK)
  .then(() => true)
  .catch(() => false);

const copyIfNotExists = async (source, destination) => {
  if (await pathExists(destination)) {
    return;
  }
  await fs.copyFile(source, destination);
};

const createDirIfNotExists = async (path) => {
  if (await pathExists(path)) {
    return;
  }
  await fs.mkdir(path);
};

const writeFile = async (path, content) => fs.writeFile(path, content);

module.exports = {
  copyIfNotExists,
  createDirIfNotExists,
  writeFile
};
