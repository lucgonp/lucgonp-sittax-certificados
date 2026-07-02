const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://certificados.stage.sittax.com.br',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    defaultCommandTimeout: 12000,
    pageLoadTimeout: 45000,
    responseTimeout: 30000,
    video: false,
    screenshotOnRunFailure: true,
    retries: { runMode: 1, openMode: 0 },
    viewportWidth: 1440,
    viewportHeight: 900,
    // Credenciais NUNCA são versionadas. Defina via `cypress.env.json` (gitignored) ou
    // variáveis de ambiente CYPRESS_USER_LOGIN / CYPRESS_USER_PASSWORD.
    // Ver cypress.env.json.example.
  },
});
