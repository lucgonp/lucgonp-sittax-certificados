const { login, expectEnvelopeOk } = require('./helpers');

describe('Dashboard', () => {
  let client;
  beforeAll(async () => {
    ({ client } = await login());
  });

  test('GET /dashboard/overview → 200 KPIs no contrato', async () => {
    const res = await client.get('/dashboard/overview');
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /dashboard/commission → 200 saldo no contrato', async () => {
    const res = await client.get('/dashboard/commission');
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /dashboard/recent-activities → 200 e respeita teto 30', async () => {
    const res = await client.get('/dashboard/recent-activities');
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
    expect(res.data.data.items.length).toBeLessThanOrEqual(30);
  });

  test('GET /dashboard/recent-activities?limit=5 → clamp e contrato', async () => {
    const res = await client.get('/dashboard/recent-activities', { params: { limit: 5 } });
    expect(res.status).toBe(200);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /dashboard/recent-activities?limit=999 → clamp ao teto 30', async () => {
    const res = await client.get('/dashboard/recent-activities', { params: { limit: 999 } });
    expect(res.status).toBe(200);
    expect(res).toSatisfyApiSpec();
    expect(res.data.data.items.length).toBeLessThanOrEqual(30);
  });

  test('GET /dashboard/portfolio-distribution → 200 distribuição no contrato', async () => {
    const res = await client.get('/dashboard/portfolio-distribution');
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
  });
});
