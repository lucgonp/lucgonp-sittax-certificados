// Comandos customizados. A interação com o form de login vive no LoginPage (POM).
import LoginPage from './pages/login.page';

// Login com cache de sessão (rápido entre testes). Valida pelo cookie de auth.
Cypress.Commands.add('login', (login, senha) => {
  const user = login || Cypress.env('USER_LOGIN');
  const pass = senha || Cypress.env('USER_PASSWORD');
  cy.session(
    ['certificados', user],
    () => {
      LoginPage.logar(user, pass);
      cy.location('pathname', { timeout: 25000 }).should('not.include', '/auth/login');
    },
    {
      validate() {
        // Auth é 100% cookie (localStorage vazio). Sessão válida = cookie do token presente.
        cy.getCookie('SittaxCertificadoAuthToken').should('exist');
      },
      cacheAcrossSpecs: true,
    },
  );
});
