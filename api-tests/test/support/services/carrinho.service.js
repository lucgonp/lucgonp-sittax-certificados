// Service do recurso Carrinho.
class CarrinhoService {
  constructor(client) {
    this.client = client;
  }

  catalogo() {
    return this.client.get('/carrinho/catalogo');
  }

  obter() {
    return this.client.get('/carrinho');
  }

  metodosPagamento() {
    return this.client.get('/carrinho/metodos-pagamento');
  }

  vouchersCarteira() {
    return this.client.get('/carrinho/vouchers-carteira');
  }

  vouchersCarteiraItens() {
    return this.client.get('/carrinho/vouchers-carteira/itens');
  }

  adicionarItem(body) {
    return this.client.post('/carrinho/itens', body);
  }

  removerItem(itemId) {
    return this.client.delete(`/carrinho/itens/${encodeURIComponent(itemId)}`);
  }

  checkout(body) {
    return this.client.post('/carrinho/checkout', body);
  }

  pedido(pedidoId) {
    return this.client.get(`/carrinho/pedidos/${encodeURIComponent(pedidoId)}`);
  }

  linkPagamento(pedidoId) {
    return this.client.get(`/carrinho/pedidos/${encodeURIComponent(pedidoId)}/link-pagamento`);
  }

  consumirVoucher(voucherId, body) {
    return this.client.post(`/carrinho/vouchers/${encodeURIComponent(voucherId)}/consumir`, body);
  }
}

module.exports = CarrinhoService;
