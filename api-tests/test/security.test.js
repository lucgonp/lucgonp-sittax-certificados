const { makeClient } = require('./helpers');

// Toda rota privada deve exigir autenticação (401 sem token).
const PROTECTED = [
  ['get', '/me'],
  ['get', '/dashboard/overview'],
  ['get', '/dashboard/commission'],
  ['get', '/dashboard/recent-activities'],
  ['get', '/dashboard/portfolio-distribution'],
  ['get', '/carteira/overview'],
  ['post', '/carteira/solicitacoes-certificados/listar'],
  ['get', '/carteira/solicitacoes/sc-01'],
  ['get', '/clientes/overview'],
  ['post', '/clientes/listar'],
  ['get', '/clientes/cl-01'],
  ['get', '/clientes/cl-01/empresas'],
  ['get', '/clientes/cl-01/solicitacoes'],
  ['get', '/clientes/cl-01/info'],
  ['get', '/carrinho/catalogo'],
  ['get', '/carrinho'],
  ['get', '/carrinho/metodos-pagamento'],
  ['get', '/carrinho/vouchers-carteira'],
  ['get', '/carrinho/vouchers-carteira/itens'],
];

describe('Segurança — rotas privadas exigem token', () => {
  const anon = makeClient(null);
  test.each(PROTECTED)('%s %s sem token → 401', async (method, path) => {
    const res = await anon[method](path);
    expect(res.status).toBe(401);
    expect(res).toSatisfyApiSpec();
  });
});
