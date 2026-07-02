const { login, expectEnvelopeErro } = require('./helpers');

// Sem um PFX real em mãos, cobrimos os caminhos de validação (seguros, não persistem):
// arquivo/senha ausentes → 422. O happy-path de leitura exige um binário válido.
describe('Certificados (leitura/upload — caminhos de validação)', () => {
  let client;
  beforeAll(async () => {
    ({ client } = await login());
  });

  test('POST /certificados/ler sem arquivo nem senha → 422', async () => {
    const res = await client.post('/certificados/ler', {}, { headers: { 'Content-Type': 'application/json' } });
    expect([400, 422]).toContain(res.status);
    expectEnvelopeErro(res);
    expect(res).toSatisfyApiSpec();
  });

  test('POST /clientes sem campos obrigatórios → 400/422', async () => {
    const res = await client.post('/clientes', {}, { headers: { 'Content-Type': 'application/json' } });
    expect([400, 422]).toContain(res.status);
    expectEnvelopeErro(res);
    expect(res).toSatisfyApiSpec();
  });
});
