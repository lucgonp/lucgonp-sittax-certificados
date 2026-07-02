// Dashboard — KPIs de certificados, saudação e card de comissão.
describe('Dashboard', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/dashboard');
    cy.contains('button', 'Dashboard', { timeout: 20000 }).should('be.visible');
  });

  it('exibe os 4 KPIs de certificados', () => {
    cy.contains(/Novos/i).should('be.visible');
    cy.contains('Ativos').should('be.visible');
    cy.contains(/Vencendo em 30 dias/i).should('be.visible');
    cy.contains('Vencidos').should('be.visible');
  });

  it('exibe o card de comissão com saldo', () => {
    cy.contains('Minha comissão').should('be.visible');
    cy.contains(/SALDO TOTAL/i).should('be.visible');
  });

  it('saúda o usuário logado (PRICILA)', () => {
    cy.contains(/PRICILA/i).should('be.visible');
  });

  it('menu principal tem Dashboard, Clientes, Carteira e Carrinho', () => {
    ['Dashboard', 'Clientes', 'Carteira', 'Carrinho'].forEach((item) => {
      cy.contains('button', item).should('be.visible');
    });
  });
});
