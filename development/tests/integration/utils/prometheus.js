const { execInContainer, restartContainer } = require('./docker');
const { writeFile } = require('./files');
const { copyToContainer } = require('./docker');
const { BUILD_PATH } = require('./constants');

const METRIC_SRC_PATH = `${BUILD_PATH}/test-metrics.txt`;
const METRIC_DEST_PATH = '/prometheus/test-metrics.txt';

const getLabelsString = (labels) => {
  if (!labels || Object.entries(labels).length === 0) {
    return '';
  }
  return `{${Object.entries(labels).map(([key, value]) => `${key}="${value}"`).join(',')}}`;
};

const getMetricString = ({ metricName, value, timestamp, labels }) =>
  `${metricName}${getLabelsString(labels)} ${value} ${timestamp}`;

const injectMetrics = async (data) => {
  const lines = data.map(getMetricString);
  lines.push('# EOF');
  await writeFile(METRIC_SRC_PATH, lines.join('\n'));
  await copyToContainer('prometheus', METRIC_SRC_PATH, METRIC_DEST_PATH);

  await execInContainer(
    'prometheus',
    `promtool tsdb create-blocks-from openmetrics ${METRIC_DEST_PATH} /prometheus`
  );
  await restartContainer('prometheus');
};

const createMetric = (metricName, instance, value = 0, millis = Date.now()) => ({
  metricName,
  value,
  timestamp: millis / 1000,
  labels: { instance, job: 'cht' }
});

const extrapolateMetrics = (startMetric, endMetric) => {
  const createCount = endMetric.timestamp - startMetric.timestamp - 1;
  const valueChangePerSec = (endMetric.value - startMetric.value) / createCount;

  const newMetrics = Array
    .from({ length: createCount })
    .map((_, i) => {
      const index = i + 1;
      const timestamp = startMetric.timestamp + index;
      const value = startMetric.value + (valueChangePerSec * index);
      return { ...startMetric, timestamp, value, labels: { ...startMetric.labels } };
    });
  return [startMetric, ...newMetrics, endMetric];
};

module.exports = {
  createMetric,
  extrapolateMetrics,
  injectMetrics
};
