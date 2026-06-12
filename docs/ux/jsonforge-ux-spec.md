# UX Specification — JSONForge

**Autor:** @ux-design-expert (Uma)
**Status:** Approved
**Versão:** 1.0
**Data:** 2026-06-11

---

## 1. Princípios de Design

1. **Developer-first / dark by default** — devs vivem em editores escuros; tema dark é o padrão.
2. **Zero fricção** — colar JSON é a primeira e única ação necessária; tudo reage automaticamente.
3. **Feedback imediato** — erro aparece na hora, com linha/coluna; sucesso mostra árvore + stats.
4. **Densidade calma** — monoespaçado para dados, sans-serif para UI; respiro suficiente.

## 2. Design Tokens (CSS Variables)

```css
/* Cores — tema dark (default) */
--bg:            #0d1117;   /* fundo app          */
--bg-panel:      #161b22;   /* painéis            */
--bg-elevated:   #1c2128;   /* cards/hover        */
--border:        #30363d;
--text:          #e6edf3;
--text-muted:    #8b949e;
--accent:        #58a6ff;   /* azul ação          */
--accent-hover:  #79c0ff;
--success:       #3fb950;
--error:         #f85149;
--warning:       #d29922;

/* Syntax highlight (tree-view) */
--syntax-key:     #79c0ff;  /* chaves            */
--syntax-string:  #a5d6ff;  /* strings           */
--syntax-number:  #79c0ff;  /* números           */
--syntax-boolean: #ff7b72;  /* true/false        */
--syntax-null:    #8b949e;  /* null              */

/* Tipografia */
--font-ui:   system-ui, -apple-system, "Segoe UI", sans-serif;
--font-mono: "SF Mono", "Cascadia Code", Consolas, "Roboto Mono", monospace;

/* Espaçamento & raio */
--radius: 8px;
--gap: 12px;
```

## 3. Layout (Wireframe ASCII)

### Desktop (≥ 900px) — duas colunas

```
┌──────────────────────────────────────────────────────────────────────┐
│  ⬢ JSONForge          [Format] [Minify] [Copy] [Sample] [Clear]  2▾   │  ← Header + Toolbar
├───────────────────────────────┬──────────────────────────────────────┤
│  INPUT                         │  OUTPUT        [ Tree | Raw ]         │
│  ┌──────────────────────────┐  │  ┌────────────────────────────────┐  │
│  │ {                        │  │  │ ▾ object {3}                   │  │
│  │   "name": "ada",         │  │  │   "name": "ada"                │  │
│  │   "skills": ["math",     │  │  │   ▾ skills [2]                 │  │
│  │ ...                      │  │  │       0: "math"                │  │
│  │                          │  │  │       1: "logic"               │  │
│  └──────────────────────────┘  │  └────────────────────────────────┘  │
├───────────────────────────────┴──────────────────────────────────────┤
│  ✓ Valid · 3 keys · depth 2 · 142 bytes              [History ▾]       │  ← StatsBar
└──────────────────────────────────────────────────────────────────────┘
```

### Estado de erro

```
├────────────────────────────────────────────────────────────────────┤
│  ✕ Invalid JSON — Unexpected token at line 4, column 12              │  ← ErrorBanner (vermelho)
└────────────────────────────────────────────────────────────────────┘
```

### Mobile (< 900px) — coluna única empilhada
Input em cima, toggle Tree/Raw, output embaixo, toolbar vira barra com scroll horizontal.

## 4. Componentes & Estados

| Componente | Estados | Interação |
|------------|---------|-----------|
| **Toolbar** | default / disabled (input vazio) | Botões com `aria-label`; indent dropdown (2/4) |
| **InputPanel** | empty (placeholder) / typing / error-highlight | Textarea monospace, foco com borda accent |
| **OutputPanel** | tree / raw (toggle) / empty | Toggle segmented control |
| **TreeNode** | collapsed / expanded / leaf | Click no caret expande/colapsa; tipos coloridos |
| **StatsBar** | valid (verde) / invalid (vermelho) / idle | Mostra keys, depth, bytes |
| **ErrorBanner** | hidden / visible | Aparece só em erro; mostra linha/coluna |
| **HistoryPanel** | empty / list (max 10) | Dropdown; clicar item recarrega no input; botão clear |

## 5. Microinterações

- **Copy** → botão mostra "Copied! ✓" por 1.5s (feedback visual, sem toast lib).
- **Format** → leve fade no output ao re-renderizar.
- **Tree caret** → rotação 90° suave (transition 120ms).
- **Erro** → ErrorBanner faz slide-in do topo; cor `--error`.
- **Debounce** → 250ms após parar de digitar para reprocessar (NFR-2).

## 6. Acessibilidade (NFR-3)

- Contraste texto/fundo ≥ 4.5:1 (tokens calibrados para AA).
- Todos os botões com `aria-label` descritivo.
- Tree-view navegável: nós focáveis, Enter/Space expande.
- `prefers-reduced-motion` → desativa transições.
- Foco visível (outline accent) em todos os controles.

## 7. Responsividade (NFR-4)

| Breakpoint | Layout |
|------------|--------|
| ≥ 900px | Duas colunas lado a lado (input / output) |
| < 900px | Coluna única empilhada; toolbar com scroll-x |
| 360px (mínimo) | Tudo legível, sem overflow horizontal no conteúdo |

## 8. Conteúdo (copy) padrão

- Placeholder do input: `Paste your JSON here…`
- Sample button carrega um JSON de exemplo com objeto aninhado + array + tipos variados.
- Estado vazio do output: `Formatted output will appear here.`
- Footer discreto: `100% client-side · your data never leaves the browser`
