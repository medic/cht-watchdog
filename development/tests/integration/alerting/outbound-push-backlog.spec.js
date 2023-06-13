const prometheus = require('../utils/prometheus');
const grafana = require('../utils/grafana');
const { expect } = require('chai');

const ALERT_RULE_NAME = 'Outbound Push Backlog';

describe('Outbound Push Backlog alert rule', () => {
  [
    [9, 100, 'Normal'],
    [10, 100, 'Pending'],
    [54, 1000, 'Normal'],
    [55, 1000, 'Pending']
  ].forEach(([backlogHr, updateSeqHr, state]) => {
    it(`is [${state}] with outbound push backlog rate [${backlogHr}] and DB change rate [${updateSeqHr}]`, async () => {
      const updateSeq = updateSeqHr * 720; // 720 hours in 30 days
      const endMs = Date.now();
      const startMs = endMs - (1000 * 60 * 60); // 1 hour ago

      const startBacklogCount = prometheus.createMetric('cht_outbound_push_backlog_count', 0, startMs);
      const endBacklogCount = prometheus.createMetric('cht_outbound_push_backlog_count', backlogHr, endMs);
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
