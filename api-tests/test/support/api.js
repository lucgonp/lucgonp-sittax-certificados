// Agregador da camada de serviços: um objeto `api` com um service por recurso, todos sobre o
// mesmo cliente HTTP. Specs orquestram `api.dashboard.overview()`, `api.carrinho.catalogo()`, etc.
const { makeClient, CREDENTIALS } = require('./client');
const AuthService = require('./services/auth.service');
const DashboardService = require('./services/dashboard.service');
const CarteiraService = require('./services/carteira.service');
const ClientesService = require('./services/clientes.service');
const CarrinhoService = require('./services/carrinho.service');
const CertificadosService = require('./services/certificados.service');

class Api {
  constructor(client) {
    this.client = client;
    this.auth = new AuthService(client);
    this.dashboard = new DashboardService(client);
    this.carteira = new CarteiraService(client);
    this.clientes = new ClientesService(client);
    this.carrinho = new CarrinhoService(client);
    this.certificados = new CertificadosService(client);
  }
}

// Api sem token (login, health, testes de guarda 401).
function anonApi() {
  return new Api(makeClient(null));
}

// Api autenticada (cacheada) — faz login uma vez e reusa o token.
let _cache = null;
async function authApi() {
  if (_cache) return _cache;
  if (!CREDENTIALS.login || !CREDENTIALS.password) {
    throw new Error(
      'Credenciais ausentes. Defina SITTAX_LOGIN e SITTAX_PASSWORD (ver .env.example).',
    );
  }
  const anon = anonApi();
  const loginRes = await anon.auth.login(CREDENTIALS);
  if (loginRes.status !== 200 || !loginRes.data?.data?.token) {
    throw new Error(`Login falhou (status ${loginRes.status}): ${JSON.stringify(loginRes.data).slice(0, 300)}`);
  }
  const token = loginRes.data.data.token;
  _cache = { api: new Api(makeClient(token)), token, usuario: loginRes.data.data.usuario, loginRes };
  return _cache;
}

module.exports = { Api, anonApi, authApi };
