const { login, expectEnvelopeOk, expectEnvelopeErro } = require('./helpers');

describe('Carteira', () => {
  let client;
  beforeAll(async () => {
    ({ client } = await login());
  });

  test('GET /carteira/overview → 200 agregado no contrato', async () => {
    const res = await client.get('/carteira/overview');
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
    // resumo_financeiro.eventos deve ter SEMPRE 6 entradas (spec minItems/maxItems 6)
    expect(res.data.data.resumo_financeiro.eventos).toHaveLength(6);
  });

  test('POST /carteira/solicitacoes-certificados/listar (em andamento) → 200 grid', async () => {
    const res = await client.post('/carteira/solicitacoes-certificados/listar', {
      paginacao: { pageNumber: 1, pageSize: 10 },
    });
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
  });

  test('POST /carteira/solicitacoes-certificados/listar?historico=true → 200 finalizadas', async () => {
    const res = await client.post(
      '/carteira/solicitacoes-certificados/listar',
      { paginacao: { pageNumber: 1, pageSize: 10 } },
      { params: { historico: true } },
    );
    expect(res.status).toBe(200);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /carteira/solicitacoes/{id} → 200 detalhe (id descoberto na listagem)', async () => {
    const lista = await client.post('/carteira/solicitacoes-certificados/listar', {
      paginacao: { pageNumber: 1, pageSize: 10 },
    });
    const tuples = lista.data?.data?.dataSet?.tuples || [];
    if (!tuples.length) {
      console.warn('[carteira] sem solicitações para detalhar — pulando detalhe.');
      return;
    }
    const id = tuples[0].id;
    const res = await client.get(`/carteira/solicitacoes/${encodeURIComponent(id)}`);
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /carteira/solicitacoes/{id} inexistente → 404 envelope de erro', async () => {
    const res = await client.get('/carteira/solicitacoes/sc-inexistente-999');
    expect(res.status).toBe(404);
    expectEnvelopeErro(res);
    expect(res).toSatisfyApiSpec();
  });
});
