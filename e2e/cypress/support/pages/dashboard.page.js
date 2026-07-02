// Page Object do Dashboard (/dashboard).
class DashboardPage {
  url = '/dashboard';

  visitar() {
    cy.visit(this.url);
    return this;
  }

  deveTerCarregado() {
    cy.contains('button', 'Dashboard', { timeout: 20000 }).should('be.visible');
    return this;
  }

  deveEstarNaRota() {
    cy.location('pathname', { timeout: 25000 }).should('eq', this.url);
    return this;
  }

  deveMostrarKpis() {
    cy.contains(/Novos/i).should('be.visible');
    cy.contains('Ativos').should('be.visible');
    cy.contains(/Vencendo em 30 dias/i).should('be.visible');
    cy.contains('Vencidos').should('be.visible');
    return this;
  }

  deveMostrarComissao() {
    cy.contains('Minha comissão').should('be.visible');
    cy.contains(/SALDO TOTAL/i).should('be.visible');
    return this;
  }

  deveSaudar(nome) {
    cy.contains(new RegExp(nome, 'i')).should('be.visible');
    return this;
  }
}

export default new DashboardPage();
