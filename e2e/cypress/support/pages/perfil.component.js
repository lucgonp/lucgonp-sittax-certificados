// Componente de perfil do usuário (dropdown no canto superior direito).
class PerfilComponent {
  elements = {
    avatar: () => cy.get('[class*="avatar"], [class*="user"], [class*="profile"], img[alt*="user"], img[alt*="avatar"]').first(),
    menuUsuario: () => cy.get('[class*="menu"], [class*="dropdown"], [role="menu"]').first(),
  };

  abrirMenu() {
    // Clica na área do perfil/avatar para abrir o dropdown
    cy.get('body').then(($body) => {
      // Tenta encontrar o trigger do menu por vários seletores possíveis
      if ($body.find('[class*="avatar"]').length > 0) {
        cy.get('[class*="avatar"]').first().click();
      } else if ($body.find('img[class*="user"]').length > 0) {
        cy.get('img[class*="user"]').first().click();
      } else {
        // Fallback: buscar pelo nome do usuário na barra superior
        cy.contains(/PRICILA|Olá/i).first().click();
      }
    });
    cy.wait(500);
    return this;
  }

  deveMostrarSaudacao(nome) {
    cy.contains(new RegExp(`Olá,?\\s*${nome}`, 'i')).should('be.visible');
    return this;
  }

  deveMostrarOpcaoCentralDeAjuda() {
    cy.contains(/Central de ajuda/i).should('be.visible');
    return this;
  }

  deveMostrarOpcaoEncerrarSessao() {
    cy.contains(/Encerrar [Ss]essão|Sair|Logout/i).should('be.visible');
    return this;
  }

  encerrarSessao() {
    cy.contains(/Encerrar [Ss]essão|Sair|Logout/i).click();
    return this;
  }

  deveEstarDeslogado() {
    cy.location('pathname', { timeout: 15000 }).should('include', '/auth/login');
    cy.getCookie('SittaxCertificadoAuthToken').should('not.exist');
    return this;
  }
}

export default new PerfilComponent();
