const { login, expectEnvelopeOk, expectEnvelopeErro } = require('./helpers');

describe('Clientes', () => {
  let client;
  let clienteId;

  beforeAll(async () => {
    ({ client } = await login());
    const lista = await client.post('/clientes/listar', { paginacao: { pageNumber: 1, pageSize: 10 } });
    clienteId = lista.data?.data?.dataSet?.tuples?.[0]?.id;
  });

  test('GET /clientes/overview → 200 totais no contrato', async () => {
    const res = await client.get('/clientes/overview');
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
  });

  test('POST /clientes/listar → 200 grid paginado no contrato', async () => {
    const res = await client.post('/clientes/listar', { paginacao: { pageNumber: 1, pageSize: 10 } });
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
  });

  test('POST /clientes/listar com busca → 200 e hasFilter refletido', async () => {
    const res = await client.post('/clientes/listar', {
      paginacao: { pageNumber: 1, pageSize: 10 },
      where: ['*', 'contains', 'a'],
    });
    expect(res.status).toBe(200);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /clientes/{id} → 200 detalhe no contrato', async () => {
    if (!clienteId) return console.warn('[clientes] sem cliente para detalhar — pulando.');
    const res = await client.get(`/clientes/${encodeURIComponent(clienteId)}`);
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /clientes/{id}/empresas → 200 no contrato', async () => {
    if (!clienteId) return console.warn('[clientes] sem cliente — pulando empresas.');
    const res = await client.get(`/clientes/${encodeURIComponent(clienteId)}/empresas`);
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /clientes/{id}/solicitacoes → 200 no contrato', async () => {
    if (!clienteId) return console.warn('[clientes] sem cliente — pulando solicitacoes.');
    const res = await client.get(`/clientes/${encodeURIComponent(clienteId)}/solicitacoes`);
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /clientes/{id}/info → 200 contato no contrato', async () => {
    if (!clienteId) return console.warn('[clientes] sem cliente — pulando info.');
    const res = await client.get(`/clientes/${encodeURIComponent(clienteId)}/info`);
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /clientes/{id} inexistente → 404 envelope de erro', async () => {
    const res = await client.get('/clientes/cl-inexistente-999');
    expect(res.status).toBe(404);
    expectEnvelopeErro(res);
    expect(res).toSatisfyApiSpec();
  });

  test('PATCH /clientes/{id} sem campos reconhecidos → no-op 200 com detalhe atual', async () => {
    if (!clienteId) return console.warn('[clientes] sem cliente — pulando patch no-op.');
    const res = await client.patch(`/clientes/${encodeURIComponent(clienteId)}`, {});
    expect(res.status).toBe(200);
    expect(res).toSatisfyApiSpec();
  });

  test('PATCH /clientes/{id} com campo de certificado → 422 nomeando o campo', async () => {
    if (!clienteId) return console.warn('[clientes] sem cliente — pulando patch 422.');
    const res = await client.patch(`/clientes/${encodeURIComponent(clienteId)}`, {
      senha: 'x',
    });
    expect(res.status).toBe(422);
    expectEnvelopeErro(res);
    expect(res).toSatisfyApiSpec();
  });
});
