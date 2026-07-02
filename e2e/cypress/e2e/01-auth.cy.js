// Autenticação — login feliz, credenciais inválidas, campos vazios e guarda de rota.
const USER = Cypress.env('USER_LOGIN');
const PASS = Cypress.env('USER_PASSWORD');
const TOKEN_COOKIE = 'SittaxCertificadoAuthToken';

describe('Autenticação', () => {
  beforeEach(() => {
    cy.clearCookies();
    Cypress.session.clearAllSavedSessions();
  });

  it('login com credenciais válidas → entra e cai no dashboard', () => {
    cy.visit('/auth/login');
    cy.get('input[type=email]').should('be.visible').type(USER);
    cy.get('input[type=password]').type(PASS, { log: false });
    cy.contains('button', 'Entrar').click();

    cy.location('pathname', { timeout: 25000 }).should('eq', '/dashboard');
    cy.getCookie(TOKEN_COOKIE).should('exist');
    cy.contains('Minha comissão').should('be.visible');
  });

  it('login com senha inválida → NÃO autentica e permanece no login', () => {
    cy.visit('/auth/login');
    cy.get('input[type=email]').type(USER);
    cy.get('input[type=password]').type('senha-errada-proposital', { log: false });
    cy.contains('button', 'Entrar').click();

    // Comportamento correto: continua em /auth/login e nenhum cookie de sessão é emitido.
    cy.wait(2500);
    cy.location('pathname').should('include', '/auth/login');
    cy.getCookie(TOKEN_COOKIE).should('not.exist');
  });

  it('campos vazios → não é possível autenticar', () => {
    cy.visit('/auth/login');
    cy.contains('button', 'Entrar').click({ force: true });
    cy.wait(1000);
    cy.location('pathname').should('include', '/auth/login');
    cy.getCookie(TOKEN_COOKIE).should('not.exist');
  });

  it('guarda de rota: acessar /dashboard sem sessão redireciona para o login', () => {
    cy.visit('/dashboard');
    cy.location('pathname', { timeout: 20000 }).should('include', '/auth/login');
  });
});
