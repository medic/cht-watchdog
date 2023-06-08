const { sleep } = require('./');

const GRAFANA_URL = 'http://127.0.0.1:3000';
const ADMIN_USER = 'medic';
const ADMIN_PASS = 'password';
const AUTH_HEADER = `Basic ${Buffer.from(ADMIN_USER + ':' + ADMIN_PASS, 'binary').toString('base64')}`;
const FETCH_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': AUTH_HEADER
};

const fetchWithTimeout = async (resource, options = {}, body) => {
  const { timeout = 1000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
    headers: FETCH_HEADERS,
    body: body ? JSON.stringify(body) : null,
  });
  clearTimeout(id);
  return response;
};

const waitUntilStarted = async (tries = 0) => {
  if (tries > 500) {
    throw new Error('Grafana failed to start!');
  }

  try {
    // https://grafana.com/docs/grafana/latest/developers/http_api/other/#health-api
    const url = new URL(`${GRAFANA_URL}/api/health`);
    await fetchWithTimeout(url);
  } catch (err) {
    console.log(err);
    await sleep(100);
    return waitUntilStarted(tries + 1);
  }
};

const getAlert = async (ruleName, instance, tries = 0) => {
  if (tries > 30) {
    throw new Error(`Could not find any alert for Rule: ${ruleName}.`);
  }
  const response = await fetchWithTimeout(new URL(`${GRAFANA_URL}/api/prometheus/grafana/api/v1/rules`));
  const alert = (await response.json())
    ?.data
    ?.groups
    ?.flatMap(group => group.rules)
    ?.find(rule => rule.name === ruleName)
    ?.alerts
    ?.find(alert => alert.labels.instance === instance);
  if (!alert) {
    await sleep(1000);
    return getAlert(ruleName, instance, tries + 1);
  }
  return alert;
};

module.exports = {
  getAlert,
  waitUntilStarted
};

