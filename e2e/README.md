# Testes E2E — Frontend Sittax Certificados (Cypress)

Testes end-to-end que dirigem um **browser real** contra o SPA de stage
`https://certificados.stage.sittax.com.br` (Angular 21). Cobrem login, guarda de rota,
dashboard, navegação pelo menu, carteira, clientes e o fluxo de compra de vouchers.

## Ambiente (WSL, sem root)

O browser do Cypress precisa de libs de sistema que **não estão** instaladas e não há sudo
sem senha. Elas foram baixadas em espaço de usuário (sem root) e são injetadas via
`LD_LIBRARY_PATH`:

- `~/cypress-libs/` — `.deb` baixados com `apt-get download` e extraídos com `dpkg-deb -x`
  (libnss3, libnspr4, libasound2t64, libxss1). Scripts: `setup-libs.sh`, `fetch-missing.sh`.
- O display vem do **WSLg** (`DISPLAY=:0`) — não precisa de Xvfb.
- `npm` do WSL vem via `corepack npm@10` (o `npm` do PATH é o shim do Windows e quebra em
  caminho WSL).

## Como rodar

Sempre pelo wrapper `run.sh` (seta `DISPLAY` + `LD_LIBRARY_PATH`):

```bash
cd ~/sittax-certificados-e2e
bash run.sh run --browser electron            # headless, todos os specs
bash run.sh run --browser electron --spec cypress/e2e/02-dashboard.cy.js
bash run.sh open                              # modo interativo (usa a janela do WSLg)
```

Credenciais (obrigatórias) via `cypress.env.json` (ver `cypress.env.json.example`) ou
`CYPRESS_USER_LOGIN` / `CYPRESS_USER_PASSWORD`. `RUN_DESTRUCTIVE=1` habilita o teste que adiciona
voucher ao carrinho — desligado por padrão para não gerar pedido/consumir saldo.

## Arquitetura — Page Object Model (POM)

Seletores e ações ficam encapsulados em **page objects**; os specs só orquestram cenários.

```
cypress/
├── e2e/                      # specs (cenários) — só chamam os page objects
│   ├── 01-auth.cy.js  02-dashboard.cy.js  03-navegacao.cy.js
│   └── 04-carteira.cy.js  05-clientes.cy.js  06-carrinho.cy.js
└── support/
    ├── commands.js           # cy.login() (cy.session) — usa o LoginPage
    └── pages/
        ├── login.page.js        dashboard.page.js   carteira.page.js
        ├── clientes.page.js     carrinho.page.js
        └── nav.component.js     # menu principal (componente compartilhado)
```

Cada page object exporta uma instância com métodos **encadeáveis** (`return this`): ações
(`logar`, `comprarVouchers`, `irParaClientes`…) e asserts (`deve...()`). Ex.:

```js
LoginPage.logar(user, pass);
DashboardPage.deveEstarNaRota().deveMostrarKpis().deveMostrarComissao();
NavMenu.irParaCarteira();
CarteiraPage.deveEstarNaRota().deveMostrarCardsFinanceiros();
```

## Cobertura (22 casos)

- **01-auth** — login válido → /dashboard; senha inválida não autentica (sem cookie); campos
  vazios não autenticam; guarda de rota (deep-link sem sessão → /auth/login).
- **02-dashboard** — 4 KPIs (Novos/Ativos/Vencendo/Vencidos), card de comissão (SALDO TOTAL),
  saudação do usuário, menu principal completo.
- **03-navegacao** — cliques no menu Dashboard/Clientes/Carteira/Carrinho e volta.
- **04-carteira** — cards financeiros (Total em vendas, Comissões, Aguardando pagamento,
  Certificados vendidos) e ações Usar/Comprar vouchers.
- **05-clientes** — totalizadores (Todos os clientes, Certificados A1/A3) e abertura do
  cadastro de cliente (sem submeter).
- **06-carrinho** — catálogo e-CPF (PF) / e-CNPJ (PJ), preço em R$, botão Adicionar, painel
  Meu carrinho. O add-ao-carrinho é gated por `RUN_DESTRUCTIVE`.

## Notas de implementação

- Auth é **100% cookie** (`SittaxCertificadoAuthToken`); localStorage/sessionStorage vazios.
  `cy.login()` usa `cy.session` com `validate` no cookie e `cacheAcrossSpecs`.
- Navegação para rotas protegidas é feita por **cliques no menu** a partir do /dashboard
  (o deep-link direto às vezes corre com a guarda durante a hidratação do Angular).
- O login espera o form ficar visível **e habilitado** antes de digitar (a hidratação diferida
  `__jsaction_bootstrap` deixava o input momentaneamente não-interativo → flake). Suíte roda
  verde com `--config retries=0`.
- Seletores do login (descobertos): `input[type=email]`, `input[type=password]`, botão texto
  "Entrar". Rotas válidas: /dashboard, /carteira, /clientes, /carrinho→/carrinho/escolher.
