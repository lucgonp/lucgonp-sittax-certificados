// Page Object da Carteira (/carteira).
class CarteiraPage {
  url = '/carteira';

  elements = {
    botaoUsarVouchers: () => cy.contains(/Usar vouchers/i),
    botaoComprarVouchers: () => cy.contains(/Comprar vouchers/i),
    abaEmAndamento: () => cy.contains(/Em andamento/i),
    abaHistorico: () => cy.contains(/Histórico/i),
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

  // --- Novos métodos: distribuição de carteira e solicitações ---

  deveMostrarDistribuicaoDeCarteira() {
    cy.contains(/Distribuição da carteira/i).should('be.visible');
    return this;
  }

  deveMostrarVouchersEmCarteira() {
    // Seção "Vouchers em carteira" mostra tipos de certificado (Certificados A1/A3)
    cy.contains(/Vouchers em carteira/i).should('be.visible');
    return this;
  }

  deveMostrarTabelaDeSolicitacoes() {
    cy.contains(/Solicitações de certificados/i).should('be.visible');
    return this;
  }

  deveTerAbasDeSolicitacao() {
    this.elements.abaEmAndamento().should('be.visible');
    this.elements.abaHistorico().should('be.visible');
    return this;
  }

  clicarAbaHistorico() {
    this.elements.abaHistorico().click();
    cy.wait(500);
    return this;
  }

  clicarAbaEmAndamento() {
    this.elements.abaEmAndamento().click();
    cy.wait(500);
    return this;
  }

  deveMostrarColunasDeSolicitacao() {
    // Colunas da tabela de solicitações: Protocolo, Solicitante, Data, Tipo, Status
    cy.get('body').then(($body) => {
      const text = $body.text();
      const temColunas =
        /Protocolo|Solicitante|Data|Tipo|Status/i.test(text);
      expect(temColunas, 'tabela de solicitações tem colunas esperadas').to.be.true;
    });
    return this;
  }

  deveMostrarPaginacaoDeSolicitacoes() {
    cy.contains(/Resultados por página|resultados/i).should('be.visible');
    return this;
  }
}

export default new CarteiraPage();
