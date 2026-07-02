// Service do recurso Clientes.
class ClientesService {
  constructor(client) {
    this.client = client;
  }

  overview() {
    return this.client.get('/clientes/overview');
  }

  listar(body = {}) {
    return this.client.post('/clientes/listar', body);
  }

  detalhe(id) {
    return this.client.get(`/clientes/${encodeURIComponent(id)}`);
  }

  empresas(id) {
    return this.client.get(`/clientes/${encodeURIComponent(id)}/empresas`);
  }

  solicitacoes(id) {
    return this.client.get(`/clientes/${encodeURIComponent(id)}/solicitacoes`);
  }

  info(id) {
    return this.client.get(`/clientes/${encodeURIComponent(id)}/info`);
  }

  atualizar(id, body) {
    return this.client.patch(`/clientes/${encodeURIComponent(id)}`, body);
  }

  // Cadastro (multipart na vida real); usado aqui p/ o caminho de validação (corpo vazio).
  criar(payload, opts = { headers: { 'Content-Type': 'application/json' } }) {
    return this.client.post('/clientes', payload, opts);
  }
}

module.exports = ClientesService;
