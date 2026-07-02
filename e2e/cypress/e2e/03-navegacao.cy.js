// Navegação pelo menu principal (cliques reais, como um usuário faria).
import DashboardPage from '../support/pages/dashboard.page';
import ClientesPage from '../support/pages/clientes.page';
import CarteiraPage from '../support/pages/carteira.page';
import CarrinhoPage from '../support/pages/carrinho.page';
import NavMenu from '../support/pages/nav.component';

describe('Navegação', () => {
  beforeEach(() => {
    cy.login();
    DashboardPage.visitar().deveTerCarregado();
  });

  it('Clientes → /clientes', () => {
    NavMenu.irParaClientes();
    ClientesPage.deveEstarNaRota().deveMostrarTotalizadores();
  });

  it('Carteira → /carteira', () => {
    NavMenu.irParaCarteira();
    CarteiraPage.deveEstarNaRota().deveTerCarregado();
  });

  it('Carrinho → /carrinho/escolher', () => {
    NavMenu.irParaCarrinho();
    CarrinhoPage.deveEstarNaRota().deveTerCarregado();
  });

  it('volta para o Dashboard', () => {
    NavMenu.irParaCarteira();
    CarteiraPage.deveEstarNaRota();
    NavMenu.irParaDashboard();
    DashboardPage.deveEstarNaRota().deveMostrarComissao();
  });
});
