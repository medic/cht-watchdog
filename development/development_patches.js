#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const PATCHES_DIR = path.join(__dirname, 'patches');
const APPLY_PATCHES_DIR = path.join(PATCHES_DIR, 'apply');
const REVERT_PATCHES_DIR = path.join(PATCHES_DIR, 'revert');

const getFileNames = async (dirPath) => fs.promises.readdir(dirPath);

const applyPatch = async (sourcePath, patchPath) => {
  try {
    const { stdout } = await exec(`patch ${sourcePath} < ${patchPath}`);
    console.log(stdout);
  } catch (e) {
    console.error(e.stdout);
  }
};

const getSourceFilePath = (patchName) => {
  const segments = patchName.split('.');
  const directories = segments.slice(0, segments.length - 3);
  const fileName = segments.slice(segments.length - 3, segments.length - 1).join('.');
  return path.join(__dirname, '../', ...directories, fileName);
};

const applyPatchesForDir = (patchesDir) => (patchName) => {
  const sourceFilePath = getSourceFilePath(patchName);
  const patchFilePath = path.join(patchesDir, patchName);
  return applyPatch(sourceFilePath, patchFilePath);
};

const applyPatches = async (patchesDir) => {
  const patchNames = await getFileNames(patchesDir);
  return Promise.all(patchNames.map(applyPatchesForDir(patchesDir)));
};

(async () => {
  const [,, mode] = process.argv;
  if (mode === 'apply') {
    await applyPatches(APPLY_PATCHES_DIR);
  } else if (mode === 'revert') {
    await applyPatches(REVERT_PATCHES_DIR);
  } else {
    console.error('Please specify mode: apply or revert');
  }
})();
