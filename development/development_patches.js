#!/usr/bin/env node
const { applyPatches, revertPatches } = require('./patches');

(async () => {
  const [,, mode] = process.argv;
  if (mode === 'apply') {
    await applyPatches();
  } else if (mode === 'revert') {
    await revertPatches();
  } else {
    console.error('Please specify mode: apply or revert');
  }
})();
