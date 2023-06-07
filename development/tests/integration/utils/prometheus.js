const { execInContainer, restartContainer } = require('./docker.js');

const DATA_PATH = '/prometheus/data.txt';

const getLabelsString = (labels) => {
  if (!labels || Object.entries(labels).length === 0) {
    return '';
  }
  return `{${Object.entries(labels).map(([key, value]) => `${key}="${value}"`).join(',')}}`;
};

const getMetricString = ({ metricName, value, timestamp, labels }) =>
  `${metricName}${getLabelsString(labels)} ${value} ${timestamp}`;

//data: Array<{ metric_name, value, timestamp, labels: { key: value } }>
const injectTestData = async (data) => {
  const lines = data.map(getMetricString);
  lines.push('# EOF');
  const dataString = lines.join('\n').replace(/"/g, '\\"');
  await execInContainer('prometheus', `sh -c "echo -e '${dataString}' > ${DATA_PATH}"`);
  await execInContainer(
    'prometheus',
    `promtool tsdb create-blocks-from openmetrics ${DATA_PATH} /prometheus`
  );
  await restartContainer('prometheus');
};

module.exports = {
  injectTestData
};
