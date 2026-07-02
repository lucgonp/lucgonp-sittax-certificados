// Carteira — cards financeiros, ações de voucher, distribuição e solicitações.
import CarteiraPage from '../support/pages/carteira.page';
import CarrinhoPage from '../support/pages/carrinho.page';

describe('Carteira', () => {
  beforeEach(() => {
    cy.login();
    CarteiraPage.visitar().deveTerCarregado();
  });

  it('exibe os cards financeiros com valores em R$', () => {
    CarteiraPage.deveMostrarCardsFinanceiros();
  });

  it('oferece as ações Usar vouchers e Comprar vouchers', () => {
    CarteiraPage.deveOferecerAcoesDeVoucher();
  });

  it('Comprar vouchers leva ao fluxo de compra', () => {
    CarteiraPage.comprarVouchers();
    CarrinhoPage.deveEstarNaRota();
    cy.contains(/e-CPF|e-CNPJ/).should('be.visible');
  });

  // --- Novos testes ---

  it('exibe a seção de vouchers em carteira com tipos de certificado', () => {
    CarteiraPage.deveMostrarVouchersEmCarteira();
  });

  it('exibe a seção de solicitações de certificados', () => {
    CarteiraPage.deveMostrarTabelaDeSolicitacoes();
  });

  it('solicitações tem abas "Em andamento" e "Histórico"', () => {
    CarteiraPage.deveTerAbasDeSolicitacao();
  });

  it('tabela de solicitações mostra colunas esperadas', () => {
    CarteiraPage.deveMostrarColunasDeSolicitacao();
  });
});
