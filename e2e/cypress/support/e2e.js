import './commands';

// O SPA Angular pode emitir erros não-fatais (ex.: chamadas de telemetria/clarity) que não
// devem derrubar o teste de UI. Só engolimos ruído conhecido; erros reais ainda estouram.
Cypress.on('uncaught:exception', (err) => {
  const ruidoConhecido = /clarity|ga\(|gtag|ResizeObserver|Non-Error promise rejection/i;
  if (ruidoConhecido.test(err.message)) return false;
  return true;
});
