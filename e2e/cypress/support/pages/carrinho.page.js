// Page Object do Carrinho / compra de vouchers (/carrinho -> /carrinho/escolher).
class CarrinhoPage {
  url = '/carrinho';

  elements = {
    botaoAdicionar: () => cy.contains('button', /Adicionar ao carrinho/i),
  };

  visitar() {
    cy.visit(this.url);
    return this;
  }

  deveTerCarregado() {
    cy.contains(/Comprar vouchers/i, { timeout: 20000 }).should('be.visible');
    return this;
  }

  deveEstarNaRota() {
    cy.location('pathname', { timeout: 15000 }).should('include', '/carrinho');
    return this;
  }

  deveMostrarCatalogo() {
    cy.contains(/Pessoa Física/i).should('be.visible');
    cy.contains('e-CPF').should('be.visible');
    cy.contains(/Pessoa Jurídica/i).should('be.visible');
    cy.contains('e-CNPJ').should('be.visible');
    return this;
  }

  deveMostrarPrecoEBotaoAdicionar() {
    cy.contains(/R\$\s?\d/).should('be.visible');
    this.elements.botaoAdicionar().should('be.visible');
    return this;
  }

  deveMostrarPainelDoCarrinho() {
    cy.contains(/Meu carrinho/i).should('be.visible');
    return this;
  }

  adicionarPrimeiroVoucher() {
    this.elements.botaoAdicionar().first().click();
    return this;
  }

  naoDeveEstarVazio() {
    cy.contains(/Seu carrinho está vazio/i).should('not.exist');
    return this;
  }
}

export default new CarrinhoPage();
