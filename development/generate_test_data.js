#!/usr/bin/env node
const readline = require('readline');

const inStream = process.stdin;
const outStream = process.stdout;

const getLabalValue = label => {
  const [key, value] = label.split('=');
  return `${key}="${value}"`;
}

const getLabelSection = labels => {
  const validLabels = labels.filter(label => label !== '');
  if(!validLabels.length) {
    return '';
  }
  return `{${validLabels.map(getLabalValue).join(',')}}`;
};

const getOpenMetric = line => {
  const [timestamp, metric, value, ...labels] = line.split(',');
  return `${metric}${getLabelSection(labels)} ${value} ${timestamp}`;
}

const rl = readline.createInterface({ input: inStream });
rl.on('line', input => {
  outStream.write(`${getOpenMetric(input)}\n`);
});
rl.on('close', () => {
  outStream.write('# EOF');
});
