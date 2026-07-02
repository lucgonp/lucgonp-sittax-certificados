// Carteira — cards financeiros e ações de voucher.
describe('Carteira', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/carteira');
    cy.contains(/Total em vendas/i, { timeout: 20000 }).should('be.visible');
  });

  it('exibe os cards financeiros com valores em R$', () => {
    cy.contains(/Total em vendas/i).should('be.visible');
    cy.contains(/Comissões geradas/i).should('be.visible');
    cy.contains(/Aguardando pagamento/i).should('be.visible');
    cy.contains(/Certificados vendidos/i).should('be.visible');
    cy.contains(/R\$\s?\d/).should('be.visible');
  });

  it('oferece as ações Usar vouchers e Comprar vouchers', () => {
    cy.contains(/Usar vouchers/i).should('be.visible');
    cy.contains(/Comprar vouchers/i).should('be.visible');
  });

  it('Comprar vouchers leva ao fluxo de compra', () => {
    cy.contains(/Comprar vouchers/i).click();
    cy.location('pathname', { timeout: 15000 }).should('include', '/carrinho');
    cy.contains(/e-CPF|e-CNPJ/).should('be.visible');
  });
});
