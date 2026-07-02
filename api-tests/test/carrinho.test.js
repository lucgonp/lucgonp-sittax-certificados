const { authApi } = require('./support/api');
const { expectEnvelopeOk, expectEnvelopeErro } = require('./support/asserts');

const DESTRUCTIVE = process.env.RUN_DESTRUCTIVE === '1';

describe('Carrinho', () => {
  let api;
  beforeAll(async () => {
    ({ api } = await authApi());
  });

  test('GET /carrinho/catalogo → 200 lista de SKUs no contrato', async () => {
    const res = await api.carrinho.catalogo();
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  test('GET /carrinho → 200 carrinho recalculado no contrato', async () => {
    const res = await api.carrinho.obter();
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /carrinho/metodos-pagamento → 200 e PIX recomendado', async () => {
    const res = await api.carrinho.metodosPagamento();
    expect(res.status).toBe(200);
    expect(res).toSatisfyApiSpec();
    const pix = res.data.data.find((m) => m.id === 'pagamento.metodo.pix');
    expect(pix).toBeDefined();
    expect(pix.recomendado).toBe(true);
  });

  test('GET /carrinho/vouchers-carteira → 200 no contrato', async () => {
    const res = await api.carrinho.vouchersCarteira();
    expect(res.status).toBe(200);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /carrinho/vouchers-carteira/itens → 200 no contrato', async () => {
    const res = await api.carrinho.vouchersCarteiraItens();
    expect(res.status).toBe(200);
    expect(res).toSatisfyApiSpec();
  });

  test('POST /carrinho/itens item inexistente → 404 envelope de erro', async () => {
    const res = await api.carrinho.adicionarItem({ produto_id: 'produto-inexistente-999', quantidade: 1 });
    expect(res.status).toBe(404);
    expectEnvelopeErro(res);
    expect(res).toSatisfyApiSpec();
  });

  test('POST /carrinho/itens quantidade inválida (0) → 400', async () => {
    const catalogo = await api.carrinho.catalogo();
    const produtoId = catalogo.data?.data?.[0]?.id;
    if (!produtoId) return console.warn('[carrinho] catálogo vazio — pulando.');
    const res = await api.carrinho.adicionarItem({ produto_id: produtoId, quantidade: 0 });
    expect(res.status).toBe(400);
    expectEnvelopeErro(res);
    expect(res).toSatisfyApiSpec();
  });

  test('Round-trip: adiciona um item e remove (recalcula o carrinho)', async () => {
    const catalogo = await api.carrinho.catalogo();
    const produtoId = catalogo.data?.data?.[0]?.id;
    if (!produtoId) return console.warn('[carrinho] catálogo vazio — pulando round-trip.');

    const add = await api.carrinho.adicionarItem({ produto_id: produtoId, quantidade: 1 });
    expect(add.status).toBe(200);
    expectEnvelopeOk(add);
    expect(add).toSatisfyApiSpec();

    const itens = add.data.data.itens || [];
    const novo = itens.find((i) => i.produto_id === produtoId) || itens[itens.length - 1];
    expect(novo).toBeDefined();

    const del = await api.carrinho.removerItem(novo.id);
    expect(del.status).toBe(200);
    expectEnvelopeOk(del);
    expect(del).toSatisfyApiSpec();
  });

  test('DELETE /carrinho/itens/{id} inexistente → 404', async () => {
    const res = await api.carrinho.removerItem('item-inexistente-999');
    expect(res.status).toBe(404);
    expectEnvelopeErro(res);
    expect(res).toSatisfyApiSpec();
  });

  test('POST /carrinho/checkout parcelas>1 em método não-crédito → 400', async () => {
    const res = await api.carrinho.checkout({ metodo_pagamento: 'pagamento.metodo.pix', parcelas: 3 });
    expect([400, 422]).toContain(res.status);
    expectEnvelopeErro(res);
    expect(res).toSatisfyApiSpec();
  });

  // --- Destrutivos: só rodam com RUN_DESTRUCTIVE=1 (consomem voucher / limpam carrinho) ---
  (DESTRUCTIVE ? test : test.skip)('POST /carrinho/vouchers/{id}/consumir → 200 protocolo', async () => {
    const disp = await api.carrinho.vouchersCarteiraItens();
    const voucherId = disp.data?.data?.itens?.[0]?.voucher_id;
    if (!voucherId) return console.warn('[carrinho] sem voucher disponível — pulando consumir.');
    const res = await api.carrinho.consumirVoucher(voucherId, { tipo_solicitacao: 'solicitacao.tipo.emissao' });
    expect(res.status).toBe(200);
    expect(res).toSatisfyApiSpec();
  });

  (DESTRUCTIVE ? test : test.skip)('POST /carrinho/checkout PIX → 201 pedido iniciado', async () => {
    const catalogo = await api.carrinho.catalogo();
    await api.carrinho.adicionarItem({ produto_id: catalogo.data.data[0].id, quantidade: 1 });
    const res = await api.carrinho.checkout({ metodo_pagamento: 'pagamento.metodo.pix' });
    expect(res.status).toBe(201);
    expect(res).toSatisfyApiSpec();
    const pedidoId = res.data.data.pedido_id;
    const resumo = await api.carrinho.pedido(pedidoId);
    expect(resumo.status).toBe(200);
    expect(resumo).toSatisfyApiSpec();
    const espera = await api.carrinho.linkPagamento(pedidoId);
    expect([200, 409]).toContain(espera.status);
    expect(espera).toSatisfyApiSpec();
  });

  test('GET /carrinho/pedidos/{id} inexistente → 404', async () => {
    const res = await api.carrinho.pedido('pedido-inexistente-999');
    expect(res.status).toBe(404);
    expectEnvelopeErro(res);
    expect(res).toSatisfyApiSpec();
  });
});
