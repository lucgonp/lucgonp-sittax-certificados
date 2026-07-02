const { authApi } = require('./support/api');
const { expectEnvelopeErro } = require('./support/asserts');

// Sem um PFX real em mãos, cobrimos os caminhos de validação (seguros, não persistem):
// arquivo/senha ausentes → 422. O happy-path de leitura exige um binário válido.
describe('Certificados (leitura/upload — caminhos de validação)', () => {
  let api;
  beforeAll(async () => {
    ({ api } = await authApi());
  });

  test('POST /certificados/ler sem arquivo nem senha → 422', async () => {
    const res = await api.certificados.ler({});
    expect([400, 422]).toContain(res.status);
    expectEnvelopeErro(res);
    expect(res).toSatisfyApiSpec();
  });

  test('POST /clientes sem campos obrigatórios → 400/422', async () => {
    const res = await api.clientes.criar({});
    expect([400, 422]).toContain(res.status);
    expectEnvelopeErro(res);
    expect(res).toSatisfyApiSpec();
  });
});
