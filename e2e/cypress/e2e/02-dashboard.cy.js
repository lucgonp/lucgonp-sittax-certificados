// Dashboard — KPIs de certificados, saudação e card de comissão.
import DashboardPage from '../support/pages/dashboard.page';
import NavMenu from '../support/pages/nav.component';

describe('Dashboard', () => {
  beforeEach(() => {
    cy.login();
    DashboardPage.visitar().deveTerCarregado();
  });

  it('exibe os 4 KPIs de certificados', () => {
    DashboardPage.deveMostrarKpis();
  });

  it('exibe o card de comissão com saldo', () => {
    DashboardPage.deveMostrarComissao();
  });

  it('saúda o usuário logado (PRICILA)', () => {
    DashboardPage.deveSaudar('PRICILA');
  });

  it('menu principal tem Dashboard, Clientes, Carteira e Carrinho', () => {
    NavMenu.deveTerTodosOsItens();
  });
});
