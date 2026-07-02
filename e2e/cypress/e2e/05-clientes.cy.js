// Clientes — grid/totais e abertura do cadastro (sem submeter, não-destrutivo).
import ClientesPage from '../support/pages/clientes.page';

describe('Clientes', () => {
  beforeEach(() => {
    cy.login();
    ClientesPage.visitar().deveTerCarregado();
  });

  it('exibe os totalizadores de clientes e certificados', () => {
    ClientesPage.deveMostrarTotalizadores();
  });

  it('tem ação de Cadastrar cliente', () => {
    ClientesPage.deveTerAcaoCadastrar();
  });

  it('abrir Cadastrar cliente exibe o formulário/campos de cadastro', () => {
    ClientesPage.abrirCadastro().deveTerAbertoCadastro();
  });
});
