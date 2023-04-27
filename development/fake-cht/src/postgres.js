const { Client } = require('pg');
const { randomUUID } = require('crypto');

const POSTGRES_CLIENT_CONFIG = {
  user: 'postgres_root',
  host: 'postgres',
  database: 'cht',
  password: 'postgres_root_password',
  port: 5432,
};

const CREATE_COUCHDB_PROGRESS = `
  CREATE TABLE IF NOT EXISTS public.couchdb_progress (
    seq character varying NULL,
    source character varying NOT NULL UNIQUE
  );
`;

const insertCouchdbProgress = (seq, dbName) => [
  `
    INSERT INTO couchdb_progress (seq, source)
    VALUES($1, $2)
    ON CONFLICT (source)
    DO
      UPDATE SET seq = $1;
  `,
  [`${seq}-${randomUUID()}`, `fake-cht/${dbName}`]
];

const populateCouchdbProcessTable = async (client, metrics) => {
  await client.query(CREATE_COUCHDB_PROGRESS);
  await client.query(...insertCouchdbProgress(metrics.couchdb.medic.update_sequence, 'medic'));
  await client.query(...insertCouchdbProgress(metrics.couchdb.sentinel.update_sequence, 'medic-sentinel'));
  await client.query(...insertCouchdbProgress(metrics.couchdb.usersmeta.update_sequence, 'medic-users-meta'));
};

const updatePostgres = async (metrics) => {
  const client = new Client(POSTGRES_CLIENT_CONFIG);
  await client.connect();
  await populateCouchdbProcessTable(client, metrics);
  await client.end();
};

module.exports = {
  updatePostgres
};
