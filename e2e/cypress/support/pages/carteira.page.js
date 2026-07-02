// Page Object da Carteira (/carteira).
class CarteiraPage {
  url = '/carteira';

  elements = {
    botaoUsarVouchers: () => cy.contains(/Usar vouchers/i),
    botaoComprarVouchers: () => cy.contains(/Comprar vouchers/i),
  };

  visitar() {
    cy.visit(this.url);
    return this;
  }

  deveTerCarregado() {
    cy.contains(/Total em vendas/i, { timeout: 20000 }).should('be.visible');
    return this;
  }

  deveEstarNaRota() {
    cy.location('pathname', { timeout: 15000 }).should('eq', this.url);
    return this;
  }

  deveMostrarCardsFinanceiros() {
    cy.contains(/Total em vendas/i).should('be.visible');
    cy.contains(/Comissões geradas/i).should('be.visible');
    cy.contains(/Aguardando pagamento/i).should('be.visible');
    cy.contains(/Certificados vendidos/i).should('be.visible');
    cy.contains(/R\$\s?\d/).should('be.visible');
    return this;
  }

  deveOferecerAcoesDeVoucher() {
    this.elements.botaoUsarVouchers().should('be.visible');
    this.elements.botaoComprarVouchers().should('be.visible');
    return this;
  }

  comprarVouchers() {
    this.elements.botaoComprarVouchers().click();
    return this;
  }
}

export default new CarteiraPage();
