const prometheus = require('../utils/prometheus');
const grafana = require('../utils/grafana');
const { expect } = require('chai');

const ALERT_RULE_NAME = 'DB Conflicts Rate';

describe('DB Conflicts Rate alert rule', () => {
  [
    [34, 100, 'Normal'],
    [35, 100, 'Pending'],
    [259, 1000, 'Normal'],
    [260, 1000, 'Pending']
  ].forEach(([backlogHr, updateSeqHr, state]) => {
    it(`is [${state}] with conflict rate [${backlogHr}] and DB change rate [${updateSeqHr}]`, async () => {
      const updateSeq = updateSeqHr * 720; // 720 hours in 30 days
      const endMs = Date.now();
      const startMs = endMs - (1000 * 60 * 60); // 1 hour ago

      const startConflictCount = prometheus.createMetric('cht_conflict_count', 0, startMs);
      const endConflictCount = prometheus.createMetric('cht_conflict_count', backlogHr, endMs);
      const conflictMetrics = prometheus.extrapolateMetrics(startConflictCount, endConflictCount);

      const startUpdateSeq = prometheus.createMetric('cht_couchdb_update_sequence', 0, startMs, { db: 'medic' });
      const endUpdateSeq = prometheus.createMetric('cht_couchdb_update_sequence', updateSeq, endMs, { db: 'medic' });
      const updateSeqMetrics = prometheus.extrapolateMetrics(startUpdateSeq, endUpdateSeq);

      await prometheus.injectMetrics([...conflictMetrics, ...updateSeqMetrics]);

      const alert = await grafana.getAlert(ALERT_RULE_NAME);

      expect(alert.state).to.equal(state);
    });
  });
});
