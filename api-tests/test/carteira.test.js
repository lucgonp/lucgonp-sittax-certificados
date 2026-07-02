const { authApi } = require('./support/api');
const { expectEnvelopeOk, expectEnvelopeErro } = require('./support/asserts');

describe('Carteira', () => {
  let api;
  beforeAll(async () => {
    ({ api } = await authApi());
  });

  test('GET /carteira/overview → 200 agregado no contrato', async () => {
    const res = await api.carteira.overview();
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
    // resumo_financeiro.eventos deve ter SEMPRE 6 entradas (spec minItems/maxItems 6)
    expect(res.data.data.resumo_financeiro.eventos).toHaveLength(6);
  });

  test('POST /carteira/solicitacoes-certificados/listar (em andamento) → 200 grid', async () => {
    const res = await api.carteira.listarSolicitacoes({ paginacao: { pageNumber: 1, pageSize: 10 } });
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
  });

  test('POST /carteira/solicitacoes-certificados/listar?historico=true → 200 finalizadas', async () => {
    const res = await api.carteira.listarSolicitacoes(
      { paginacao: { pageNumber: 1, pageSize: 10 } },
      { historico: true },
    );
    expect(res.status).toBe(200);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /carteira/solicitacoes/{id} → 200 detalhe (id descoberto na listagem)', async () => {
    const lista = await api.carteira.listarSolicitacoes({ paginacao: { pageNumber: 1, pageSize: 10 } });
    const tuples = lista.data?.data?.dataSet?.tuples || [];
    if (!tuples.length) {
      console.warn('[carteira] sem solicitações para detalhar — pulando detalhe.');
      return;
    }
    const res = await api.carteira.solicitacao(tuples[0].id);
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /carteira/solicitacoes/{id} inexistente → 404 envelope de erro', async () => {
    const res = await api.carteira.solicitacao('sc-inexistente-999');
    expect(res.status).toBe(404);
    expectEnvelopeErro(res);
    expect(res).toSatisfyApiSpec();
  });
});
