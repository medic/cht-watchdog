const prometheus = require('../utils/prometheus');
const grafana = require('../utils/grafana');
const { expect } = require('chai');

const ALERT_RULE_NAME = 'Sentinel Backlog';

describe('Sentinel Backlog alert rule', () => {
  [
    [499, 10, 'Normal'],
    [520, 10, 'Pending'],
    [620, 121, 'Normal'],
    [620, 100, 'Pending']
  ].forEach(([backlogHr, updateSeqHr, state]) => {
    it(`is [${state}] with sentinel backlog rate [${backlogHr}] and DB change rate [${updateSeqHr}]`, async () => {
      const updateSeq = updateSeqHr * 720; // 720 hours in 30 days
      const endMs = Date.now();
      const startMs = endMs - (1000 * 60 * 60); // 1 hour ago

      const startBacklogCount = prometheus.createMetric('cht_sentinel_backlog_count', 0, startMs);
      const endBacklogCount = prometheus.createMetric('cht_sentinel_backlog_count', backlogHr, endMs);
      const backlogMetrics = prometheus.extrapolateMetrics(startBacklogCount, endBacklogCount);

      const startUpdateSeq = prometheus.createMetric('cht_couchdb_update_sequence', 0, startMs, { db: 'medic' });
      const endUpdateSeq = prometheus.createMetric('cht_couchdb_update_sequence', updateSeq, endMs, { db: 'medic' });
      const updateSeqMetrics = prometheus.extrapolateMetrics(startUpdateSeq, endUpdateSeq);

      await prometheus.injectMetrics([...backlogMetrics, ...updateSeqMetrics]);

      const alert = await grafana.getAlert(ALERT_RULE_NAME);

      expect(alert.state).to.equal(state);
    });
  });
});
