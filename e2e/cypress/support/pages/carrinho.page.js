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

  // --- Novos métodos: seletores de tipo/quantidade e vouchers em carteira ---

  deveMostrarSeletoresDeTipo() {
    // Seletor de tipo de certificado (A1 / A3)
    cy.contains(/A1/i).should('be.visible');
    cy.contains(/A3/i).should('be.visible');
    return this;
  }

  deveMostrarOpcoesDeValidade() {
    // Opções de validade: 12, 24 ou 36 meses
    cy.get('body').then(($body) => {
      const text = $body.text();
      const temValidades =
        /12\s*meses|24\s*meses|36\s*meses|1\s*ano|2\s*anos|3\s*anos/i.test(text);
      expect(temValidades, 'opções de validade visíveis').to.be.true;
    });
    return this;
  }

  deveMostrarSeletorDeQuantidade() {
    // Verifica presença de seletor numérico ou botões de quantidade
    cy.get('body').then(($body) => {
      const temQuantidade =
        $body.find('input[type="number"]').length > 0 ||
        $body.find('select').length > 0 ||
        /quantidade|qtd|voucher/i.test($body.text());
      expect(temQuantidade, 'seletor de quantidade visível').to.be.true;
    });
    return this;
  }

  deveMostrarVouchersEmCarteira() {
    // Seção mostrando vouchers já adquiridos pelo escritório
    cy.contains(/Vouchers em carteira|Minha carteira|vouchers disponíveis/i).should('be.visible');
    return this;
  }

  deveMostrarResumoDeCompra() {
    // Resumo do pedido / total
    cy.contains(/Total|Resumo|Subtotal/i).should('be.visible');
    return this;
  }
}

export default new CarrinhoPage();
