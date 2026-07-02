# Sittax Certificados — Testes automatizados

Testes automatizados do sistema **Sittax Gestão de Certificado** (ambiente de stage). Dois níveis:

| Pasta | O que é | Stack |
|-------|---------|-------|
| [`api-tests/`](api-tests) | Testes de **contrato/integração** da API v1 — validam cada resposta real contra o `openapi.yaml` (`jest-openapi`) + regras de negócio | Node, Jest, jest-openapi, axios |
| [`e2e/`](e2e) | Testes **end-to-end** do frontend (SPA Angular 21) dirigindo um browser real | Cypress |

Alvos de stage:
- API: `https://api.certificados.stage.sittax.com.br/v1`
- Front: `https://certificados.stage.sittax.com.br`

## Credenciais (não versionadas)

Nenhuma credencial é commitada. Configure um usuário de stage localmente:

- **api-tests:** copie `api-tests/.env.example` → `api-tests/.env` e preencha `SITTAX_LOGIN` /
  `SITTAX_PASSWORD` (ou exporte as variáveis).
- **e2e:** copie `e2e/cypress.env.json.example` → `e2e/cypress.env.json` (ou use
  `CYPRESS_USER_LOGIN` / `CYPRESS_USER_PASSWORD`).

Ambos os arquivos reais (`.env`, `cypress.env.json`) estão no `.gitignore`.

## Rodar

```bash
# API
cd api-tests && npm install && npm test

# E2E (precisa de um browser; ver e2e/README.md p/ o setup de libs sem root no WSL)
cd e2e && npm install && npx cypress run --browser electron
```

Detalhes, cobertura e notas de ambiente em cada `README.md` de subpasta.

## Achados registrados pela suíte de API

1. `openapi.yaml`: descrição de `arquivoPfx` (POST /clientes) sem aspas quebrava o YAML — corrigido.
2. `POST /login` e `GET /me` retornam tipos divergentes do contrato (id/RoleId/Nivel/Inadimplencia
   como string onde o contrato declara integer/boolean).

Veja `api-tests/README.md`.
