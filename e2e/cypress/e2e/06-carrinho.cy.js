// Carrinho / compra de vouchers — catálogo, seletores e estado do carrinho (não-destrutivo por padrão).
// O add-ao-carrinho só roda com CYPRESS_RUN_DESTRUCTIVE=1 (gera pedido/consome saldo).
import CarrinhoPage from '../support/pages/carrinho.page';

const DESTRUCTIVE = Cypress.env('RUN_DESTRUCTIVE') === '1' || Cypress.env('RUN_DESTRUCTIVE') === true;

describe('Carrinho — compra de vouchers', () => {
  beforeEach(() => {
    cy.login();
    CarrinhoPage.visitar().deveTerCarregado();
  });

  it('mostra o catálogo com e-CPF (PF) e e-CNPJ (PJ)', () => {
    CarrinhoPage.deveMostrarCatalogo();
  });

  it('exibe preço em R$ e botão Adicionar ao carrinho', () => {
    CarrinhoPage.deveMostrarPrecoEBotaoAdicionar();
  });

  it('mostra o painel Meu carrinho', () => {
    CarrinhoPage.deveMostrarPainelDoCarrinho();
  });

  // --- Novos testes ---

  it('exibe seletores de tipo de certificado A1 e A3', () => {
    CarrinhoPage.deveMostrarSeletoresDeTipo();
  });

  it('exibe opções de validade do certificado', () => {
    CarrinhoPage.deveMostrarOpcoesDeValidade();
  });

  it('exibe seletor ou controle de quantidade de vouchers', () => {
    CarrinhoPage.deveMostrarSeletorDeQuantidade();
  });

  (DESTRUCTIVE ? it : it.skip)('adiciona um voucher e reflete no carrinho', () => {
    CarrinhoPage.adicionarPrimeiroVoucher();
    cy.wait(1500);
    CarrinhoPage.naoDeveEstarVazio();
  });
});
