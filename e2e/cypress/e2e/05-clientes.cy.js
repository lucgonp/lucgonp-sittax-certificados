// Clientes — grid/totais, busca, tabela, paginação e abertura do cadastro (sem submeter, não-destrutivo).
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

  // --- Novos testes ---

  it('exibe o campo de busca para filtrar clientes', () => {
    ClientesPage.deveTerCampoDeBusca();
  });

  it('exibe o seletor de ordenação', () => {
    ClientesPage.deveTerSeletorDeOrdenacao();
  });

  it('exibe a tabela com colunas Cliente, Empresa, Tipo de certificado e Status', () => {
    ClientesPage.deveMostrarTabelaDeClientes();
  });

  it('mostra a contagem de resultados na tabela', () => {
    ClientesPage.deveTerResultadosNaTabela();
  });

  it('exibe paginação com "Resultados por página"', () => {
    ClientesPage.deveMostrarPaginacao();
  });
});
