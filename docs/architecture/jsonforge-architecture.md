# Architecture — JSONForge

**Autor:** @architect (Aria)
**Status:** Approved
**Versão:** 1.0
**Data:** 2026-06-11

---

## 1. Decisão de Stack

| Camada | Escolha | Justificativa |
|--------|---------|---------------|
| Build tool | **Vite 5** | Dev server instantâneo, build estático otimizado, auto-detectado pelo Vercel. |
| UI library | **React 18 + TypeScript** | Componentização clara para tree-view recursiva; type-safety no parsing. |
| Estilo | **CSS puro + CSS Variables** (design tokens) | **Decisão crítica:** sem Tailwind/PostCSS para minimizar dependências e tornar o build estático **bulletproof** no Vercel. Zero risco de versão de plugin. |
| Parsing | **`JSON.parse` nativo** + locator de erro custom | Sem libs externas. Computamos linha/coluna a partir da posição do erro. |
| Persistência | **`localStorage`** | Constraint CON-1: sem DB. |
| Deploy | **Vercel (static)** | Output `dist/`, sem serverless, sem env vars. |
| Testes | **Vitest** | Integra nativamente com Vite; testa a lógica pura de parsing/stats. |

### Princípio norteador
> **Minimize moving parts.** Toda dependência adicional é uma fonte potencial de falha no
> deploy. JSONForge precisa de React, TypeScript e Vite — nada mais no runtime.
> A lógica de domínio (parse, format, stats, error-locator) é **pura e testável**, sem React.

## 2. Estrutura de Pastas

```
jsonforge/
├── index.html               # Entry HTML
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json              # Config de deploy estático
├── .gitignore
├── README.md
├── AIOX-LOG.md              # Log do pipeline AIOX (raiz)
├── docs/                    # Artefatos AIOX
│   ├── prd/
│   ├── architecture/
│   ├── ux/
│   └── stories/
└── src/
    ├── main.tsx             # Bootstrap React
    ├── App.tsx              # Orquestra estado e layout
    ├── index.css            # Design tokens + estilos globais
    ├── lib/
    │   ├── jsonEngine.ts    # Lógica pura: parse, format, minify, locator de erro
    │   ├── stats.ts         # Cálculo de estatísticas (chaves, profundidade, bytes)
    │   └── history.ts       # Wrapper de localStorage (load/save/clear)
    ├── lib/__tests__/
    │   ├── jsonEngine.test.ts
    │   └── stats.test.ts
    └── components/
        ├── Toolbar.tsx      # Botões: format, minify, copy, clear, sample, indent
        ├── InputPanel.tsx   # Textarea de input
        ├── OutputPanel.tsx  # Texto formatado + toggle tree/raw
        ├── TreeView.tsx     # Tree-view recursiva colapsável
        ├── TreeNode.tsx     # Nó individual (recursivo)
        ├── StatsBar.tsx     # Barra de estatísticas
        ├── ErrorBanner.tsx  # Banner de erro com linha/coluna
        └── HistoryPanel.tsx # Lista de histórico (localStorage)
```

## 3. Fluxo de Dados (Data Flow)

```
[InputPanel] --(texto cru)--> App.state.input
       |
       v  (debounce 250ms)
[jsonEngine.process(input, indent)]
       |
       +--> sucesso: { formatted, parsed, minified }  --> [OutputPanel/TreeView] + [StatsBar]
       |                                                 --> history.save() (debounced)
       |
       +--> erro: { message, line, column }            --> [ErrorBanner]
```

- **Estado central** vive em `App.tsx` via `useState` + `useMemo` (sem state lib externa).
- `jsonEngine` é **função pura** — input string → resultado discriminated-union (`{ok:true,...} | {ok:false, error}`).
- Histórico é efeito colateral isolado em `history.ts`.

## 4. Modelo de Erro (Error Locator)

`JSON.parse` lança `SyntaxError`. Em V8 (Node/Chrome) a mensagem contém `position N`.
Algoritmo do locator:

1. Capturar o `SyntaxError`.
2. Extrair `position` via regex (`/position (\d+)/`); fallback para 0.
3. Converter `position` → `{ line, column }` contando `\n` no texto até aquela posição.
4. Retornar `{ ok: false, error: { message, line, column, position } }`.

Isso satisfaz **FR-3** de forma cross-browser-tolerante (degradação graciosa se `position` ausente).

## 5. Decisões Arquiteturais (ADRs resumidos)

- **ADR-1:** CSS puro em vez de Tailwind → reduz risco de build/deploy. *Trade-off:* mais CSS manual; aceitável para escopo single-page.
- **ADR-2:** Lógica de domínio separada de React (`lib/`) → testável com Vitest sem render. *Rastreabilidade:* FR-2..FR-7.
- **ADR-3:** Sem state manager (Redux/Zustand) → `useState`/`useMemo` bastam para escopo. *Trade-off:* zero.
- **ADR-4:** `localStorage` com try/catch e cap de 10 itens → robusto a quota/modo privado. *Rastreabilidade:* FR-8, NFR-1.

## 6. Mapa de Rastreabilidade (Constitution Art. IV — No Invention)

| Componente | Requisito atendido |
|------------|-------------------|
| `jsonEngine.format/minify` | FR-2, FR-4 |
| `jsonEngine.process` (error locator) | FR-3 |
| `TreeView`/`TreeNode` | FR-5 |
| `Toolbar` (copy) | FR-6 |
| `stats.ts` / `StatsBar` | FR-7 |
| `history.ts` / `HistoryPanel` | FR-8, FR-9 |
| `Toolbar` (sample) | FR-10 |
| Sem rede, build estático | NFR-1, NFR-5 |
| Debounce + useMemo | NFR-2 |
| CSS tokens, aria-labels | NFR-3, NFR-4 |

## 7. Pipeline de Build & Deploy

```
npm install        # instala react, react-dom, vite, typescript, vitest
npm run test       # Vitest (lógica pura)
npm run build      # vite build → dist/ (estático)
vercel --prod      # deploy do dist/ (framework auto-detect: Vite)
```

`vercel.json` declara framework Vite e SPA rewrite (defensivo, embora seja single-page).
