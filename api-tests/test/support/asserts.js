// Asserts do envelope padrão Sittax (feature 002) reutilizados pelos specs.

function expectEnvelopeOk(res) {
  expect(res.data).toBeDefined();
  expect(res.data.ok).toBe(true);
  expect(res.data.status).toBe(res.status);
  expect(Array.isArray(res.data.erros)).toBe(true);
  expect(res.data.erros).toHaveLength(0);
  expect(res.data).toHaveProperty('data');
}

function expectEnvelopeErro(res) {
  expect(res.data).toBeDefined();
  expect(res.data.ok).toBe(false);
  expect(Array.isArray(res.data.erros)).toBe(true);
  expect(res.data.erros.length).toBeGreaterThan(0);
}

module.exports = { expectEnvelopeOk, expectEnvelopeErro };
