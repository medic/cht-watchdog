const prometheus = require('../utils/prometheus.js');
const grafana = require('../utils/grafana.js');
const { expect } = require('chai');

const ALERT_RULE_UID = 'FzCrECYVk';

describe('Sentinel Backlog alert rule', () => {
  it('my first test', async () => {
    const now = Date.now() / 1000;

    const testData = [
      { timestamp: now, metricName: 'cht_sentinel_backlog_count', value: 500, labels: { instance: 'http://hello.world', job: 'cht' }  },
    ];
    await prometheus.injectTestData(testData);

    const alertAnnotations = await grafana.getAnnotationsForAlert(ALERT_RULE_UID);
    expect(alertAnnotations.length).to.be.greaterThan(0);
    expect(alertAnnotations[0].newState).to.equal('Pending');
  });
});
