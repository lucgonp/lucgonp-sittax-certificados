// Comandos customizados do frontend Sittax Certificados.
// DOM de /auth/login (descoberto): input[type=email] (placeholder "E-mail"),
// input[type=password] (placeholder "Digite sua senha"), botão texto "Entrar".

Cypress.Commands.add('preencherLogin', (login, senha) => {
  // App Angular 21 com hidratação diferida (__jsaction_bootstrap): o form é renderizado e
  // só depois fica interativo. Esperamos o input existir, estar visível e habilitado (com
  // folga) antes de digitar — evita corrida de hidratação sem depender de retry.
  cy.get('input[type=email]', { timeout: 20000 }).should('be.visible').and('not.be.disabled');
  cy.get('input[type=password]').should('be.visible').and('not.be.disabled');
  cy.get('input[type=email]').clear().type(login);
  cy.get('input[type=password]').clear().type(senha, { log: false });
  cy.contains('button', 'Entrar').should('be.enabled').click();
});

// Login com cache de sessão (rápido entre testes). Valida que saiu de /auth/login.
Cypress.Commands.add('login', (login, senha) => {
  const user = login || Cypress.env('USER_LOGIN');
  const pass = senha || Cypress.env('USER_PASSWORD');
  cy.session(
    ['certificados', user],
    () => {
      cy.visit('/auth/login');
      cy.preencherLogin(user, pass);
      // Sucesso = navegou para fora do /auth/login.
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
