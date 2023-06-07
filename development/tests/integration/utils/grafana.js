const { sleep } = require('./');

const GRAFANA_URL = 'http://127.0.0.1:3000';
const ADMIN_USER = 'medic';
const ADMIN_PASS = 'password';
const AUTH_HEADER = `Basic ${Buffer.from(ADMIN_USER + ':' + ADMIN_PASS, 'binary').toString('base64')}`;
const FETCH_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': AUTH_HEADER
};

const fetchWithTimeout =  async (resource, options = {}, body) => {
  const { timeout = 1000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
    headers: FETCH_HEADERS,
    body: body ? JSON.stringify(body): null,
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

const getAlertRuleId = async (alertUID) => {
  // https://grafana.com/docs/grafana/next/developers/http_api/alerting_provisioning/
  const response = await fetchWithTimeout(new URL(`${GRAFANA_URL}/api/v1/provisioning/alert-rules/${alertUID}`));
  return (await response.json()).id;
};

const getAnnotationsForAlert = async (alertUID, tries = 0) => {
  if (tries > 60) {
    throw new Error(`Could not find any annotations for alert: ${alertUID}.`);
  }
  const alertRuleId = await getAlertRuleId(alertUID);
  // https://grafana.com/docs/grafana/latest/developers/http_api/annotations/
  const response = await fetchWithTimeout(new URL(`${GRAFANA_URL}/api/annotations?alertId=${alertRuleId}`));
  const annotations = await response.json();
  if (!annotations.length) {
    await sleep(1000);
    return getAnnotationsForAlert(alertUID, tries + 1);
  }
  return annotations.reverse();
};

module.exports = {
  getAnnotationsForAlert,
  waitUntilStarted
};

