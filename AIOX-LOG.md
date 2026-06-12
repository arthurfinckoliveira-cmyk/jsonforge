# AIOX Log — JSONForge

> Ferramenta de produtividade para devs: **JSON Formatter & Validator** 100% client-side.
> Construída de ponta a ponta com o pipeline multi-agente do **Synkra AIOX**.

- **Stack:** Vite 5 + React 18 + TypeScript + CSS puro
- **Persistência:** `localStorage` (sem banco de dados)
- **Deploy:** Vercel (estático)

---

## @aiox-master

**Pergunta:** "Por onde começar para construir uma ferramenta web pelo workflow completo do AIOX?"

**Resposta resumida:** Orion (aiox-master) orientou que a decisão crítica é o **tema** — escolher
algo de escopo cirúrgico que seja *input simples → transformação pura no client → output visual*,
para não travar nas fases finais (dev/deploy). Recomendou stack de mínimo atrito (sem
Tailwind/PostCSS) para garantir deploy estático bulletproof no Vercel, e definiu a sequência de
orquestração `@pm → @architect → @ux → @sm → @po → @dev → @qa → @devops`, com o `AIOX-LOG.md`
preenchido em tempo real. Tema escolhido pelo usuário: **JSON Formatter & Validator** (JSONForge).

## @pm

**Decisão de PRD:** Definido PRD v1.0 com visão ("cole JSON quebrado, receba JSON impecável — ou o
erro exato, na linha exata"), 3 personas (dev backend, frontend, integração), **10 requisitos
funcionais** (FR-1..FR-10: input, format, validate c/ linha-coluna, minify, tree-view, copy, stats,
histórico, clear, sample), **5 NFRs** (privacidade total, performance, a11y AA, responsividade,
deploy estático) e **4 constraints** (sem DB, sem backend, deploy Vercel, pipeline AIOX). Escopo
v2.0 (conversão de formatos, JSONPath, diff) explicitamente **fora** do MVP (Art. IV — No Invention).

## @architect

**Decisão de stack:** **Vite 5 + React 18 + TypeScript + CSS puro (CSS variables)**.
Decisão-chave: **não usar Tailwind/PostCSS** para minimizar dependências e tornar o build estático
livre de risco de versão de plugin no Vercel. A **lógica de domínio** (`parse`, `format`, `minify`,
`stats`, error-locator) foi isolada em `src/lib/` como **funções puras testáveis**, sem dependência
de React. Error-locator próprio converte `SyntaxError` em `{line, column}` (suporta mensagens V8
modernas + fallback por `position`). Persistência via `localStorage` com try/catch. Sem state
manager (apenas `useState`/`useMemo`). ADRs e mapa de rastreabilidade FR→componente documentados.

## @ux-design-expert

**Spec gerada:** Tema **dark developer-first** com design tokens em CSS variables
(`--bg:#0d1117`, `--accent:#58a6ff`, cores de syntax para key/string/number/boolean/null).
Layout de **duas colunas** (input | output) em desktop ≥900px, **coluna única** empilhada em
mobile. Componentes especificados com seus estados: Toolbar (Format/Minify/Copy/Sample/Clear +
indent 2/4), InputPanel, OutputPanel (toggle Tree/Raw), TreeView/TreeNode (caret colapsável,
tipos coloridos), StatsBar (valid/invalid/idle), ErrorBanner (slide-in vermelho com linha/coluna),
HistoryPanel (dropdown, máx 10). Microinterações: "Copied! ✓" por 1.5s, caret rotaciona 90°,
debounce 250ms. Acessibilidade AA: contraste calibrado, `aria-label` em todos os controles,
`prefers-reduced-motion`, foco visível. Footer reforça privacidade:
`100% client-side · your data never leaves the browser`.

## @sm

**Stories criadas:**
- **Story 1.1: JSONForge Core — Format, Validate, Tree-view & History** — story única cobrindo o MVP
  completo, com **10 Acceptance Criteria** rastreados a FR/NFR e 9 tasks (scaffold → lib → componentes
  → testes → build).

## @po

**Veredicto:** **GO [9/10]** — checklist de 10 pontos aprovado. Story segue template, ACs testáveis
e rastreados a FR/NFR (sem invenção), tasks cobrem todos os ACs, escopo coeso, constraints (sem
DB/backend) respeitadas, alinhada com Architecture + UX spec. Único ponto de atenção: dependências
ambientais (git/vercel CLI ausentes) — **não** é da story, já anotado pelo @devops. Liberada para o @dev.

## @dev

**Modo usado:** YOLO (autônomo)

**Arquivos criados:**
- Scaffold: `package.json`, `vite.config.ts`, `tsconfig.json` (+ `app`/`node`), `index.html`,
  `vercel.json`, `.gitignore`, `README.md`
- Lógica pura: `src/lib/jsonEngine.ts`, `src/lib/stats.ts`, `src/lib/history.ts`
- Testes: `src/lib/__tests__/jsonEngine.test.ts`, `src/lib/__tests__/stats.test.ts`
- UI: `src/main.tsx`, `src/App.tsx`, `src/index.css` e 8 componentes em `src/components/`
  (Toolbar, InputPanel, OutputPanel, TreeView, TreeNode, StatsBar, ErrorBanner, HistoryPanel)

**Resultado:** `npm run test` → **9/9 verde**. `npm run build` → **limpo** (TS strict, sem warnings),
`dist/` gerado (~49 KB gzip JS).

## @qa

**Veredicto:** **PASS** ✅

**Issues encontrados:** Nenhum bloqueante. Único item: `npm audit` reportou 5 vulnerabilidades
**exclusivamente de devDependencies** (esbuild/vite/vitest dev-server) — sem impacto no build
estático em produção; aceito e documentado. 7 quality checks aprovados (traceability, tests, build,
runtime smoke HTTP 200, constraints sem-rede confirmado por grep, code quality strict, security scan).

## @devops

**Comando de deploy:**
```bash
# pré-flight: git instalado via winget, repo inicializado e commitado localmente
gh repo create jsonforge --public --source=. --remote=origin --push
npx vercel --prod --yes
```

**URL final:** _(preenchida após o deploy — ver seção abaixo / topo do README)_

- **GitHub:** _(pendente autenticação `gh auth login`)_
- **Vercel:** _(pendente autenticação `vercel login` ou token)_

## Reflexão

O que mais surpreendeu foi como **separar a lógica de domínio do React** (tudo em `src/lib/` como
funções puras) tornou os testes triviais e o QA gate objetivo — 9 testes cobriram o coração da
ferramenta sem precisar renderizar nada. O que travou foi puramente **ambiental**: git e Vercel CLI
não estavam instalados e ambos os logins (GitHub/Vercel) são interativos, o que separa a entrega de
código (100% autônoma) da entrega de deploy (precisa de credenciais humanas). O que eu faria
diferente: validar o ambiente de deploy **no início** (como o @devops fez no pré-flight) para que a
autenticação aconteça em paralelo ao desenvolvimento, em vez de virar o gargalo final.
