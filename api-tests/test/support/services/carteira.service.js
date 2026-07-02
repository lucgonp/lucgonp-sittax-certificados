// Service do recurso Carteira.
class CarteiraService {
  constructor(client) {
    this.client = client;
  }

  overview() {
    return this.client.get('/carteira/overview');
  }

  listarSolicitacoes(body = {}, params = {}) {
    return this.client.post('/carteira/solicitacoes-certificados/listar', body, { params });
  }

  solicitacao(id) {
    return this.client.get(`/carteira/solicitacoes/${encodeURIComponent(id)}`);
  }
}

module.exports = CarteiraService;
