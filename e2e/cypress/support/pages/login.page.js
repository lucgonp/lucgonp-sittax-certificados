// Page Object da tela de login (/auth/login).
class LoginPage {
  url = '/auth/login';

  elements = {
    email: () => cy.get('input[type=email]', { timeout: 20000 }),
    senha: () => cy.get('input[type=password]'),
    botaoEntrar: () => cy.contains('button', 'Entrar'),
  };

  visitar() {
    cy.visit(this.url);
    return this;
  }

  // App Angular 21 com hidratação diferida (__jsaction_bootstrap): o form é renderizado e só
  // depois fica interativo. Esperamos visível E habilitado antes de digitar (evita flake).
  preencher(login, senha) {
    this.elements.email().should('be.visible').and('not.be.disabled');
    this.elements.senha().should('be.visible').and('not.be.disabled');
    this.elements.email().clear().type(login);
    this.elements.senha().clear().type(senha, { log: false });
    return this;
  }

  submeter() {
    this.elements.botaoEntrar().should('be.enabled').click();
    return this;
  }

  submeterForcado() {
    this.elements.botaoEntrar().click({ force: true });
    return this;
  }

  logar(login, senha) {
    return this.visitar().preencher(login, senha).submeter();
  }

  devePermanecerNoLogin() {
    cy.location('pathname').should('include', this.url);
    return this;
  }
}

export default new LoginPage();
