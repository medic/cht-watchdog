const prometheus = require('../utils/prometheus.js');
const grafana = require('../utils/grafana.js');
const { expect } = require('chai');

const ALERT_RULE_NAME = 'Sentinel Backlog';

describe('Sentinel Backlog alert rule', () => {
  let instance;

  beforeEach(() => {
    instance = `test-instance-${Date.now()}`;
  });

  [
    [499, 'Normal'],
    [500, 'Pending'],
  ].forEach(([value, expectedState]) => {
    it(`has state [${expectedState}] when the backlog is [${value}]`, async () => {
      const testData = [{
        timestamp: Date.now() / 1000,
        metricName: 'cht_sentinel_backlog_count',
        value,
        labels: { instance, job: 'cht' }
      }];
      await prometheus.injectTestData(testData);

      const alert = await grafana.getAlert(ALERT_RULE_NAME, instance);

      expect(alert.state).to.equal(expectedState);
    });
  });
});
