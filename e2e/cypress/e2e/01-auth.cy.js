// Autenticação — login feliz, credenciais inválidas, campos vazios e guarda de rota.
import LoginPage from '../support/pages/login.page';
import DashboardPage from '../support/pages/dashboard.page';

const USER = Cypress.env('USER_LOGIN');
const PASS = Cypress.env('USER_PASSWORD');
const TOKEN_COOKIE = 'SittaxCertificadoAuthToken';

describe('Autenticação', () => {
  beforeEach(() => {
    cy.clearCookies();
    Cypress.session.clearAllSavedSessions();
  });

  it('login com credenciais válidas → entra e cai no dashboard', () => {
    LoginPage.logar(USER, PASS);

    DashboardPage.deveEstarNaRota();
    cy.getCookie(TOKEN_COOKIE).should('exist');
    DashboardPage.deveMostrarComissao();
  });

  it('login com senha inválida → NÃO autentica e permanece no login', () => {
    LoginPage.visitar().preencher(USER, 'senha-errada-proposital').submeter();

    cy.wait(2500);
    LoginPage.devePermanecerNoLogin();
    cy.getCookie(TOKEN_COOKIE).should('not.exist');
  });

  it('campos vazios → não é possível autenticar', () => {
    LoginPage.visitar().submeterForcado();

    cy.wait(1000);
    LoginPage.devePermanecerNoLogin();
    cy.getCookie(TOKEN_COOKIE).should('not.exist');
  });

  it('guarda de rota: acessar /dashboard sem sessão redireciona para o login', () => {
    DashboardPage.visitar();
    LoginPage.devePermanecerNoLogin();
  });
});
