# Testes de integração — API Sittax Gestão de Certificado v1

Testes de contrato/integração que batem na API **real** de stage
(`https://api.certificados.stage.sittax.com.br/v1`) e validam cada resposta contra o
contrato `openapi.yaml` usando `jest-openapi` (`toSatisfyApiSpec`), além de asserts de
regra de negócio (envelope Sittax, teto de 30 atividades, 6 eventos de resumo financeiro,
PIX recomendado, 401 em rota privada, 404/422 nos caminhos de erro etc.).

## Arquitetura — camada de serviços (um service por recurso)

Nenhuma chamada axios crua nos specs: cada recurso tem um **service** que encapsula os endpoints,
e os specs só orquestram (`api.dashboard.overview()`, `api.carrinho.adicionarItem(...)`).

```
test/
├── support/
│   ├── client.js            # baseURL, .env loader, makeClient(token), init do jest-openapi
│   ├── asserts.js           # expectEnvelopeOk / expectEnvelopeErro
│   ├── api.js               # Api (agrega os services) + authApi() (login cacheado) / anonApi()
│   └── services/
│       ├── auth.service.js       dashboard.service.js   carteira.service.js
│       ├── clientes.service.js   carrinho.service.js    certificados.service.js
└── *.test.js                # specs — só orquestram os services
```

```js
const { authApi, anonApi } = require('./support/api');
const { api } = await authApi();            // login uma vez, reusa o token
const res = await api.carteira.overview();  // service por recurso
```

## Como rodar

O `npx`/`jest` do Windows não roda em caminho UNC do WSL — invoque o node do WSL direto:

```bash
cd ~/sittax-certificados-test
npm install                                  # uma vez
node ./node_modules/jest/bin/jest.js --runInBand --verbose
```

Variáveis (opcionais):

- `BASE_URL` — sobrescreve a base (default: stage).
- `SITTAX_LOGIN` / `SITTAX_PASSWORD` — credenciais de stage (obrigatórias; ver `.env.example`).
- `RUN_DESTRUCTIVE=1` — habilita os testes que **consomem voucher** e **fazem checkout**
  (POST /carrinho/vouchers/{id}/consumir e POST /carrinho/checkout felizes). Desligados por
  padrão para não gastar vouchers da carteira nem limpar o carrinho.

## Cobertura

30 rotas do contrato: Auth (`/health`, `/login`, `/me`), Dashboard (4), Carteira (overview,
listar, detalhe), Clientes (overview, listar, detalhe, empresas, solicitacoes, info, patch),
Carrinho (catálogo, carrinho, métodos, vouchers, itens add/remove, checkout, pedidos,
link-pagamento), Certificados (/certificados/ler, POST /clientes — caminhos de validação).
Cada rota privada também é testada sem token (deve dar 401).

## Achados (bugs pegos pelos testes)

> Os testes AFIRMAM o contrato e deixam falhar onde a API diverge — não forçam passar.

1. **Defeito no próprio `openapi.yaml`** (corrigido na cópia local para o parser carregar):
   linha da `arquivoPfx` em `POST /clientes` tinha a descrição sem aspas com vírgula dentro
   de um flow-mapping YAML `{ }` — `description: Certificado PFX (binário, não base64)` — o
   que quebra o YAML numa chave fantasma `não base64)`. **Corrigir no arquivo-fonte** pondo
   aspas: `description: 'Certificado PFX (binário, não base64)'`.

2. **`POST /login` e `GET /me` divergem do contrato (tipos):**
   - `login.data.usuario.id` volta UUID string; contrato diz `integer`.
   - `/me`: `IdDoUsuario` e `RoleId` voltam UUID string (contrato `integer`); `Nivel` volta
     `"3"` string (contrato `integer`); `Inadimplencia` volta `"false"` string (contrato
     `boolean`).
   - Ou a API deve serializar os tipos corretos, ou o contrato deve declarar string. São os 2
     únicos testes vermelhos; todo o resto (56) está verde.
