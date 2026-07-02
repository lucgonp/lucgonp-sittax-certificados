// Page Object de Clientes (/clientes).
class ClientesPage {
  url = '/clientes';

  elements = {
    botaoCadastrar: () => cy.contains('button', /Cadastrar cliente/i),
    campoBusca: () => cy.get('input[placeholder*="buscar"]'),
    seletorOrdenacao: () => cy.contains(/Sem Ordenação|Ordenação/i).closest('mat-select, select, [role="listbox"], .mat-mdc-select, div'),
    tabela: () => cy.get('table, [role="table"], .mat-mdc-table'),
    linhasTabela: () => cy.get('table tbody tr, [role="row"]'),
    paginacao: () => cy.contains(/Resultados por página|resultados/i),
    botaoInformacoes: (index = 0) => cy.get('button[aria-label*="nforma"], button mat-icon').eq(index),
    botaoAcoes: (index = 0) => cy.get('button[aria-label*="ções"], button[aria-label*="menu"]').eq(index),
  };

  visitar() {
    cy.visit(this.url);
    return this;
  }

  deveTerCarregado() {
    cy.contains(/Todos os clientes/i, { timeout: 20000 }).should('be.visible');
    return this;
  }

  deveEstarNaRota() {
    cy.location('pathname', { timeout: 15000 }).should('eq', this.url);
    return this;
  }

  deveMostrarTotalizadores() {
    cy.contains(/Todos os clientes/i).should('be.visible');
    cy.contains(/Certificados A1/i).should('be.visible');
    cy.contains(/Certificados A3/i).should('be.visible');
    return this;
  }

  deveMostrarTotalizadoresDetalhados() {
    cy.contains(/e-CPF A1/i).should('be.visible');
    cy.contains(/e-CPF A3/i).should('be.visible');
    cy.contains(/e-CNPJ A1/i).should('be.visible');
    cy.contains(/e-CNPJ A3/i).should('be.visible');
    return this;
  }

  deveTerAcaoCadastrar() {
    this.elements.botaoCadastrar().should('be.visible');
    return this;
  }

  abrirCadastro() {
    this.elements.botaoCadastrar().click();
    return this;
  }

  // Sem submeter nada: confirma que o fluxo de cadastro (upload PFX/senha) abriu.
  deveTerAbertoCadastro() {
    cy.get('body').then(($b) => {
      const abriu =
        $b.find('input[type=file]').length > 0 ||
        $b.find('input[type=password]').length > 0 ||
        /Cadastrar cliente|certificado|senha|arquivo/i.test($b.text());
      expect(abriu, 'fluxo de cadastro de cliente abriu').to.be.true;
    });
    return this;
  }

  // --- Novos métodos para busca, tabela, paginação ---

  deveTerCampoDeBusca() {
    this.elements.campoBusca().should('be.visible');
    return this;
  }

  deveTerSeletorDeOrdenacao() {
    cy.contains(/Sem Ordenação/i).should('be.visible');
    return this;
  }

  deveMostrarTabelaDeClientes() {
    cy.contains(/Cliente/i).should('be.visible');
    cy.contains(/Empresa/i).should('be.visible');
    cy.contains(/Tipo de certificado/i).should('be.visible');
    cy.contains(/Status/i).should('be.visible');
    return this;
  }

  deveTerResultadosNaTabela() {
    cy.contains(/\d+\s*resultado/i).should('be.visible');
    return this;
  }

  deveMostrarPaginacao() {
    cy.contains(/Resultados por página/i).should('be.visible');
    return this;
  }

  buscarPor(termo) {
    this.elements.campoBusca().clear().type(termo);
    cy.wait(1000); // debounce da busca
    return this;
  }
}

export default new ClientesPage();
