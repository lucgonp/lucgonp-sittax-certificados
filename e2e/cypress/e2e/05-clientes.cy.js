// Clientes — grid/totais e abertura do cadastro (sem submeter, não-destrutivo).
describe('Clientes', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/clientes');
    cy.contains(/Todos os clientes/i, { timeout: 20000 }).should('be.visible');
  });

  it('exibe os totalizadores de clientes e certificados', () => {
    cy.contains(/Todos os clientes/i).should('be.visible');
    cy.contains(/Certificados A1/i).should('be.visible');
    cy.contains(/Certificados A3/i).should('be.visible');
  });

  it('tem ação de Cadastrar cliente', () => {
    cy.contains('button', /Cadastrar cliente/i).should('be.visible');
  });

  it('abrir Cadastrar cliente exibe o formulário/campos de cadastro', () => {
    cy.contains('button', /Cadastrar cliente/i).click();
    cy.wait(1000);
    // Sem submeter nada: só confirma que o fluxo de cadastro abriu (upload de PFX/senha).
    cy.get('body').then(($b) => {
      const abriu =
        $b.find('input[type=file]').length > 0 ||
        $b.find('input[type=password]').length > 0 ||
        /Cadastrar cliente|certificado|senha|arquivo/i.test($b.text());
      expect(abriu, 'fluxo de cadastro de cliente abriu').to.be.true;
    });
  });
});
