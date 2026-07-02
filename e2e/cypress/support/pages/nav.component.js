// Componente compartilhado: menu principal (botões Dashboard/Clientes/Carteira/Carrinho).
const ITENS = ['Dashboard', 'Clientes', 'Carteira', 'Carrinho'];

class NavMenu {
  item(label) {
    return cy.contains('button', label);
  }

  ir(label) {
    this.item(label).click();
    return this;
  }

  irParaDashboard() { return this.ir('Dashboard'); }
  irParaClientes() { return this.ir('Clientes'); }
  irParaCarteira() { return this.ir('Carteira'); }
  irParaCarrinho() { return this.ir('Carrinho'); }

  deveTerTodosOsItens() {
    ITENS.forEach((i) => this.item(i).should('be.visible'));
    return this;
  }
}

export default new NavMenu();
export { ITENS };
