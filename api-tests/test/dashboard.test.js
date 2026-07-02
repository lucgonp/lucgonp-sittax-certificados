const { authApi } = require('./support/api');
const { expectEnvelopeOk } = require('./support/asserts');

describe('Dashboard', () => {
  let api;
  beforeAll(async () => {
    ({ api } = await authApi());
  });

  test('GET /dashboard/overview → 200 KPIs no contrato', async () => {
    const res = await api.dashboard.overview();
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /dashboard/commission → 200 saldo no contrato', async () => {
    const res = await api.dashboard.commission();
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /dashboard/recent-activities → 200 e respeita teto 30', async () => {
    const res = await api.dashboard.recentActivities();
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
    expect(res.data.data.items.length).toBeLessThanOrEqual(30);
  });

  test('GET /dashboard/recent-activities?limit=5 → clamp e contrato', async () => {
    const res = await api.dashboard.recentActivities({ limit: 5 });
    expect(res.status).toBe(200);
    expect(res).toSatisfyApiSpec();
  });

  test('GET /dashboard/recent-activities?limit=999 → clamp ao teto 30', async () => {
    const res = await api.dashboard.recentActivities({ limit: 999 });
    expect(res.status).toBe(200);
    expect(res).toSatisfyApiSpec();
    expect(res.data.data.items.length).toBeLessThanOrEqual(30);
  });

  test('GET /dashboard/portfolio-distribution → 200 distribuição no contrato', async () => {
    const res = await api.dashboard.portfolioDistribution();
    expect(res.status).toBe(200);
    expectEnvelopeOk(res);
    expect(res).toSatisfyApiSpec();
  });
});
