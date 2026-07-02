// Carrinho / compra de vouchers — catálogo e estado do carrinho (não-destrutivo por padrão).
// O add-ao-carrinho + checkout só rodam com CYPRESS_RUN_DESTRUCTIVE=1 (gera pedido/consome saldo).
const DESTRUCTIVE = Cypress.env('RUN_DESTRUCTIVE') === '1' || Cypress.env('RUN_DESTRUCTIVE') === true;

describe('Carrinho — compra de vouchers', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/carrinho');
    cy.contains(/Comprar vouchers/i, { timeout: 20000 }).should('be.visible');
  });

  it('mostra o catálogo com e-CPF (PF) e e-CNPJ (PJ)', () => {
    cy.contains(/Pessoa Física/i).should('be.visible');
    cy.contains('e-CPF').should('be.visible');
    cy.contains(/Pessoa Jurídica/i).should('be.visible');
    cy.contains('e-CNPJ').should('be.visible');
  });

  it('exibe preço em R$ e botão Adicionar ao carrinho', () => {
    cy.contains(/R\$\s?\d/).should('be.visible');
    cy.contains('button', /Adicionar ao carrinho/i).should('be.visible');
  });

  it('mostra o painel Meu carrinho', () => {
    cy.contains(/Meu carrinho/i).should('be.visible');
  });

  (DESTRUCTIVE ? it : it.skip)('adiciona um voucher e reflete no carrinho', () => {
    cy.contains('button', /Adicionar ao carrinho/i).first().click();
    cy.wait(1500);
    // O carrinho deixa de estar vazio.
    cy.contains(/Seu carrinho está vazio/i).should('not.exist');
  });
});
