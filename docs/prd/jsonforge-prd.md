# PRD — JSONForge

**Autor:** @pm (Morgan)
**Status:** Approved
**Versão:** 1.0
**Data:** 2026-06-11

---

## 1. Visão (Vision Statement)

**JSONForge** é uma ferramenta de produtividade client-side para desenvolvedores que
transforma JSON cru em uma representação **formatada, validada e navegável** — sem
servidor, sem banco de dados e sem enviar dados sensíveis para lugar nenhum. Tudo
acontece no navegador do usuário.

> "Cole JSON quebrado. Receba JSON impecável — ou o erro exato, na linha exata."

## 2. Problema

Desenvolvedores lidam com JSON o dia inteiro: respostas de API, logs, configs, payloads
de webhook. Os problemas recorrentes:

- JSON minificado em uma linha só é **ilegível**.
- Quando o JSON é inválido, a mensagem do `JSON.parse` nativo é críptica (`Unexpected token`)
  e **não diz a linha/coluna**.
- Ferramentas online populares **enviam o conteúdo para servidores** — risco para dados
  sensíveis (tokens, PII).
- Estruturas profundas são difíceis de explorar sem colapsar nós.

## 3. Objetivos e Métricas de Sucesso

| Objetivo | Métrica de sucesso |
|----------|--------------------|
| Formatar JSON instantaneamente | Resultado < 50ms para payloads até 1MB |
| Localizar erros com precisão | Mensagem com **linha e coluna** exatas |
| Privacidade total | **Zero** requisições de rede com o conteúdo do usuário |
| Reuso de trabalho | Histórico das últimas N entradas via `localStorage` |
| Output visual útil | Tree-view colapsável + syntax highlight |

## 4. Personas

- **Dev Backend "Bia"** — debugando resposta de API de 800 linhas; precisa ver a
  estrutura rápido e achar onde o JSON está malformado.
- **Dev Frontend "Téo"** — colando config de feature flag; quer minificar antes de commitar.
- **Dev de Integração "Rui"** — inspecionando payload de webhook com dados sensíveis;
  **não pode** usar ferramentas que mandam dados pra servidor.

## 5. Requisitos Funcionais (FR)

- **FR-1** — O usuário cola/digita texto JSON em uma área de input.
- **FR-2** — O sistema **formata** (pretty-print) o JSON com indentação configurável (2/4 espaços).
- **FR-3** — O sistema **valida** o JSON e, em caso de erro, exibe a mensagem com **linha e coluna**.
- **FR-4** — O sistema **minifica** o JSON (remove espaços) sob demanda.
- **FR-5** — O sistema exibe uma **tree-view colapsável** da estrutura, com tipos coloridos.
- **FR-6** — O usuário pode **copiar** o resultado formatado/minificado para o clipboard.
- **FR-7** — O sistema mostra **estatísticas**: número de chaves, profundidade máxima, tamanho em bytes.
- **FR-8** — O sistema mantém um **histórico** das últimas 10 entradas válidas em `localStorage`,
  recarregáveis com um clique.
- **FR-9** — O usuário pode **limpar** input e histórico.
- **FR-10** — O sistema oferece um **exemplo** de JSON para onboarding (botão "Load sample").

## 6. Requisitos Não-Funcionais (NFR)

- **NFR-1 (Privacidade)** — Nenhum dado do usuário sai do navegador. Sem analytics que
  capturem conteúdo. Sem backend.
- **NFR-2 (Performance)** — Formatação reativa com debounce; UI nunca trava em payloads ≤ 1MB.
- **NFR-3 (Acessibilidade)** — Contraste AA, navegação por teclado, `aria-label` em controles.
- **NFR-4 (Responsividade)** — Layout funcional de 360px (mobile) a 1920px (desktop).
- **NFR-5 (Deploy)** — Build 100% estático, publicável no Vercel sem serverless functions
  nem variáveis de ambiente.

## 7. Constraints (CON)

- **CON-1** — **Sem banco de dados.** Persistência apenas via `localStorage`.
- **CON-2** — **Sem backend / sem rede.** Tudo client-side.
- **CON-3** — Deploy obrigatório no **Vercel** com URL pública.
- **CON-4** — Deve passar pelo pipeline AIOX: @pm → @architect → @ux → @sm → @po → @dev → @qa → @devops.

## 8. Fora de Escopo (Out of Scope) — v1.0

- Conversão JSON ↔ YAML/CSV/XML.
- JSONPath / query language.
- Diff entre dois JSONs.
- Compartilhamento via URL.
- Edição inline na tree-view.

> Estes ficam registrados como candidatos a v2.0, mas **não** entram na v1.0 (Article IV — No Invention).

## 9. Critérios de Aceite de Alto Nível

1. Colar um JSON válido produz output formatado em tree-view + texto, com estatísticas.
2. Colar um JSON inválido produz mensagem de erro com linha/coluna, sem quebrar a UI.
3. Botões de formatar, minificar, copiar, limpar e load-sample funcionam.
4. Histórico persiste após refresh da página (localStorage).
5. Build estático publicado no Vercel com URL pública acessível.
