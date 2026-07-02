// Perfil do usuário e Logout — dropdown, saudação, opções e encerramento de sessão.
import DashboardPage from '../support/pages/dashboard.page';
import PerfilComponent from '../support/pages/perfil.component';
import LoginPage from '../support/pages/login.page';

describe('Perfil do usuário e Logout', () => {
  beforeEach(() => {
    cy.login();
    DashboardPage.visitar().deveTerCarregado();
  });

  it('dropdown do perfil mostra saudação com o nome do usuário', () => {
    PerfilComponent.abrirMenu();
    PerfilComponent.deveMostrarSaudacao('PRICILA');
  });

  it('dropdown mostra opção "Central de ajuda"', () => {
    PerfilComponent.abrirMenu();
    PerfilComponent.deveMostrarOpcaoCentralDeAjuda();
  });

  it('dropdown mostra opção "Encerrar Sessão"', () => {
    PerfilComponent.abrirMenu();
    PerfilComponent.deveMostrarOpcaoEncerrarSessao();
  });

  it('clicar em "Encerrar Sessão" redireciona ao login e remove cookie', () => {
    PerfilComponent.abrirMenu();
    PerfilComponent.encerrarSessao();
    LoginPage.devePermanecerNoLogin();
    cy.getCookie('SittaxCertificadoAuthToken').should('not.exist');
  });
});
