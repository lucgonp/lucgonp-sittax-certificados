const { authApi, anonApi } = require('./support/api');
const { expectEnvelopeOk, expectEnvelopeErro } = require('./support/asserts');
const { CREDENTIALS } = require('./support/client');

describe('Auth', () => {
  let ctx;
  beforeAll(async () => {
    ctx = await authApi();
  });

  test('GET /health → 200 status ok (sem envelope)', async () => {
    const res = await anonApi().auth.health();
    expect(res.status).toBe(200);
    expect(res).toSatisfyApiSpec();
    expect(res.data.status).toBe('ok');
  });

  test('POST /login → 200 autentica e respeita o contrato', async () => {
    expect(ctx.loginRes.status).toBe(200);
    expectEnvelopeOk(ctx.loginRes);
    expect(typeof ctx.loginRes.data.data.token).toBe('string');
    expect(ctx.loginRes).toSatisfyApiSpec();
  });

  test('POST /login com senha errada → 401/422 no envelope de erro', async () => {
    const res = await anonApi().auth.login({
      login: CREDENTIALS.login,
      password: 'senha-errada-proposital',
    });
    expect([401, 403, 422]).toContain(res.status);
    expectEnvelopeErro(res);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /me → 200 claims do usuário autenticado', async () => {
    const res = await ctx.api.auth.me();
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /me sem token → 401', async () => {
    const res = await anonApi().auth.me();
    expect(res.status).toBe(401);
    expect(res).toSatisfyApiSpec();
  });
});
