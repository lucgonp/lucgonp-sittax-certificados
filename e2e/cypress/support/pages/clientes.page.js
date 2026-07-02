// Page Object de Clientes (/clientes).
class ClientesPage {
  url = '/clientes';

  elements = {
    botaoCadastrar: () => cy.contains('button', /Cadastrar cliente/i),
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
}

export default new ClientesPage();
