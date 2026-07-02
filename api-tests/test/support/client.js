const fs = require('fs');
const path = require('path');
const axios = require('axios');
const jestOpenAPI = require('jest-openapi').default;

const ROOT = path.join(__dirname, '..', '..');

// Registra o matcher toSatisfyApiSpec contra o contrato canônico (carregado por todo spec via api).
jestOpenAPI(path.join(ROOT, 'openapi.yaml'));

// Loader mínimo de .env (gitignored) — sem dependência. Credenciais NUNCA vão para o repositório.
(function loadEnv() {
  const p = path.join(ROOT, '.env');
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

const BASE_URL = process.env.BASE_URL || 'https://api.certificados.stage.sittax.com.br/v1';
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

module.exports = { ROOT, BASE_URL, CREDENTIALS, makeClient };
