const express = require('express');
const fs = require('fs');
const initialResponse = require('../initial-response.json');
const prometheusMiddleware = require('prometheus-api-metrics');
const { updatePostgres } = require('./postgres');

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const randomGauge = (min, max, current, maxChange) => {
  const value = getRandomInt(current - maxChange, current + maxChange);
  return Math.max(min, Math.min(max, value));
};

const randomCounter = (current, changeFactor) => {
  const change = Math.floor(Math.random() * changeFactor * 10);
  return getRandomInt(current, current + change);
};

const getVersion = () => ({ app: '4.1.1', node: 'v16.17.1', couchdb: '2.3.1' });

const getCouchDb = ({ name, update_sequence, doc_count, doc_del_count, fragmentation }) => ({
  name,
  update_sequence: randomCounter(update_sequence, 100),
  doc_count: randomCounter(doc_count, 100),
  doc_del_count: randomCounter(doc_del_count, 1),
  fragmentation: randomGauge(1, 10, fragmentation, 1) + Math.random(),
});

const getAllCouchDbs = ({ medic, sentinel, usersmeta, users }) => ({
  medic: getCouchDb(medic),
  sentinel: getCouchDb(sentinel),
  usersmeta: getCouchDb(usersmeta),
  users: getCouchDb(users),
});

const getDate = ({ uptime }) => ({
  current: Date.now(),
  uptime: uptime + 10 + Math.random(),
});

const getSentinel = ({ backlog }) => ({
  backlog: randomGauge(0, 30, backlog, 2),
});

const getOutgoingTotal = ({ due, scheduled, muted, failed, delivered }) => ({
  due: randomGauge(0, 1000, due, 3),
  scheduled: randomGauge(0, 1000, scheduled, 3),
  muted: randomGauge(0, 1000, muted,3),
  failed: randomCounter(failed, 1),
  delivered: randomCounter(delivered, 5),
});

const getOutgoingLastHundredPending = (last) => ({
  pending: randomGauge(0, 100, last.pending, 2),
  'forwarded-to-gateway': randomGauge(0, 100, last['forwarded-to-gateway'], 2),
  'received-by-gateway': randomGauge(0, 100, last['received-by-gateway'], 2),
  'forwarded-by-gateway': randomGauge(0, 100, last['forwarded-by-gateway'], 2),
});

const getOutgoingLastHundredFinal = ({ sent, delivered, failed }) => ({
  sent: randomGauge(0, 100, sent, 4),
  delivered: randomGauge(0, 100, delivered, 2),
  failed: randomGauge(0, 100, failed, 2),
});

const getOutgoingLastHundredMuted = ({ denied, cleared, muted, duplicate }) => ({
  denied: randomGauge(0, 100, denied, 2),
  cleared: randomGauge(0, 100, cleared, 2),
  muted: randomGauge(0, 100, muted, 2),
  duplicate: randomGauge(0, 100, duplicate, 2),
});

const getOutgoingLastHundred = ({ pending, final, muted }) => ({
  pending: getOutgoingLastHundredPending(pending),
  final: getOutgoingLastHundredFinal(final),
  muted: getOutgoingLastHundredMuted(muted),
});

const getMessaging = ({ outgoing: { total, last_hundred } }) => ({
  outgoing: {
    total: getOutgoingTotal(total),
    last_hundred: getOutgoingLastHundred(last_hundred),
  },
});

const getOutboundPush = ({ backlog }) => ({
  backlog: randomGauge(0, 30, backlog, 2),
});

const getFeedback = ({ count }) => ({
  count: randomCounter(count,1),
});

const getConflict = ({ count }) => ({
  count: randomCounter(count, 1),
});

const getReplicationLimit = ({ count }) => ({
  count: randomGauge(0, 15, count, 2),
});

const getConnectedUsers = ({ count }) => ({
  count: randomGauge(0, 9999, count, 50),
});

const app = express();
let lastResponse;
try {
  lastResponse = require('../last-response.json');
  console.log('Using last-response data.');
} catch (e) {
  lastResponse = initialResponse;
  console.log('Using initial-response data.');
}

app.use(prometheusMiddleware({
  metricsPath: '/api/v1/express-metrics',
  // based on one-month analysed period of production traffic
  durationBuckets: [
    0.004, 0.007, 0.013, 0.027, 0.05,
    0.1, 0.25, 0.5, 1, 2,
    3, 5, 7.5, 10, 25,
    45, 90, 180, 360, 600,
    1200, 1800, 3600
  ],
}));

app.get('/api/v2/monitoring', (req, res) => {
  const metrics = {
    version: getVersion(),
    couchdb: getAllCouchDbs(lastResponse.couchdb),
    date: getDate(lastResponse.date),
    sentinel: getSentinel(lastResponse.sentinel),
    messaging: getMessaging(lastResponse.messaging),
    outbound_push: getOutboundPush(lastResponse.outbound_push),
    feedback: getFeedback(lastResponse.feedback),
    conflict: getConflict(lastResponse.conflict),
    replication_limit: getReplicationLimit(lastResponse.replication_limit),
    connected_users: getConnectedUsers(lastResponse.connected_users),
  };
  lastResponse = metrics;
  updatePostgres(metrics);
  fs.writeFileSync('./last-response.json', JSON.stringify(metrics, null, 2));
  console.log(`Sent metrics at ${new Date()}`);
  res.json(metrics);
});

app.listen(8081);
