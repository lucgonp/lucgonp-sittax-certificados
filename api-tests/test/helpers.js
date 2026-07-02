const fs = require('fs');
const path = require('path');
const axios = require('axios');
const jestOpenAPI = require('jest-openapi').default;

// Registra o matcher toSatisfyApiSpec contra o contrato canônico.
// Como todo arquivo de teste dá require neste helper, o matcher fica disponível globalmente.
const SPEC_PATH = path.join(__dirname, '..', 'openapi.yaml');
jestOpenAPI(SPEC_PATH);

// Loader mínimo de .env (gitignored) — sem dependência. Credenciais NUNCA vão para o repositório.
(function loadEnv() {
  const p = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(p)) return;
  for (const raw of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const k = line.slice(0, eq).trim();
    const v = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!(k in process.env)) process.env[k] = v;
  }
})();

const BASE_URL =
  process.env.BASE_URL || 'https://api.certificados.stage.sittax.com.br/v1';
const CREDENTIALS = {
  login: process.env.SITTAX_LOGIN,
  password: process.env.SITTAX_PASSWORD,
};

// Cliente axios que NUNCA lança em status HTTP — para podermos asserir 4xx/5xx.
function makeClient(token) {
  return axios.create({
    baseURL: BASE_URL,
    validateStatus: () => true,
    timeout: 25000,
    headers: {
      Accept: 'application/json, text/plain, */*',
      Origin: 'https://certificados.stage.sittax.com.br',
      Referer: 'https://certificados.stage.sittax.com.br/',
      'x-correlation-id': `it-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

let _cache = null;
async function login() {
  if (_cache) return _cache;
  if (!CREDENTIALS.login || !CREDENTIALS.password) {
    throw new Error(
      'Credenciais ausentes. Defina SITTAX_LOGIN e SITTAX_PASSWORD (ver .env.example) ' +
        'no ambiente ou num arquivo .env (gitignored).',
    );
  }
  const anon = makeClient(null);
  const res = await anon.post('/login', CREDENTIALS);
  if (res.status !== 200 || !res.data?.data?.token) {
    throw new Error(
      `Login falhou (status ${res.status}): ${JSON.stringify(res.data).slice(0, 300)}`,
    );
  }
  const token = res.data.data.token;
  _cache = { token, usuario: res.data.data.usuario, client: makeClient(token), loginRes: res };
  return _cache;
}

// Afirma o envelope padrão Sittax (feature 002).
function expectEnvelopeOk(res) {
  expect(res.data).toBeDefined();
  expect(res.data.ok).toBe(true);
  expect(res.data.status).toBe(res.status);
  expect(Array.isArray(res.data.erros)).toBe(true);
  expect(res.data.erros).toHaveLength(0);
  expect(res.data).toHaveProperty('data');
}

function expectEnvelopeErro(res) {
  expect(res.data).toBeDefined();
  expect(res.data.ok).toBe(false);
  expect(Array.isArray(res.data.erros)).toBe(true);
  expect(res.data.erros.length).toBeGreaterThan(0);
}

module.exports = {
  BASE_URL,
  CREDENTIALS,
  makeClient,
  login,
  expectEnvelopeOk,
  expectEnvelopeErro,
};
