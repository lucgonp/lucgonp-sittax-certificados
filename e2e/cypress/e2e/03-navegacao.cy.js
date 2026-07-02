// Navegação pelo menu principal (cliques reais, como um usuário faria).
describe('Navegação', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/dashboard');
    cy.contains('button', 'Dashboard', { timeout: 20000 }).should('be.visible');
  });

  it('Clientes → /clientes', () => {
    cy.contains('button', 'Clientes').click();
    cy.location('pathname', { timeout: 15000 }).should('eq', '/clientes');
    cy.contains(/Todos os clientes/i).should('be.visible');
  });

  it('Carteira → /carteira', () => {
    cy.contains('button', 'Carteira').click();
    cy.location('pathname', { timeout: 15000 }).should('eq', '/carteira');
    cy.contains(/Total em vendas/i).should('be.visible');
  });

  it('Carrinho → /carrinho/escolher', () => {
    cy.contains('button', 'Carrinho').click();
    cy.location('pathname', { timeout: 15000 }).should('include', '/carrinho');
    cy.contains(/Comprar vouchers/i).should('be.visible');
  });

  it('volta para o Dashboard', () => {
    cy.contains('button', 'Carteira').click();
    cy.location('pathname', { timeout: 15000 }).should('eq', '/carteira');
    cy.contains('button', 'Dashboard').click();
    cy.location('pathname', { timeout: 15000 }).should('eq', '/dashboard');
    cy.contains('Minha comissão').should('be.visible');
  });
});
