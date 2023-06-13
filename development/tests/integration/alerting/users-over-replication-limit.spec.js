const prometheus = require('../utils/prometheus');
const grafana = require('../utils/grafana');
const { expect } = require('chai');

const ALERT_RULE_NAME = 'Users Over Replication Limit';

describe('Users Over Replication Limit alert rule', () => {
  [
    [2, 100, 'Normal'],
    [3, 100, 'Pending'],
    [31, 10000, 'Normal'],
    [32, 10000, 'Pending']
  ].forEach(([usersOverLimit, userCount, state]) => {
    it(`is [${state}] with users over rep limit rate [${usersOverLimit}] and [${userCount}] users`, async () => {
      const endMs = Date.now();
      const startMs = endMs - (1000 * 60 * 60 * 24); // 1 day ago

      const startUsersOverLimitCount = prometheus.createMetric('cht_replication_limit_count', 0, startMs);
      const endUsersOverLimitCount = prometheus.createMetric('cht_replication_limit_count', usersOverLimit, endMs);
      const replicationLimitMetrics = prometheus.extrapolateMetrics(startUsersOverLimitCount, endUsersOverLimitCount);

      const startUserCount = prometheus.createMetric('cht_connected_users_count', 0, startMs);
      const endUserCount = prometheus.createMetric('cht_couchdb_update_sequence', userCount, endMs);
      const userCountMetrics = prometheus.extrapolateMetrics(startUserCount, endUserCount);

      await prometheus.injectMetrics([...replicationLimitMetrics, ...userCountMetrics]);

      const alert = await grafana.getAlert(ALERT_RULE_NAME);

      expect(alert.state).to.equal(state);
    });
  });
});
