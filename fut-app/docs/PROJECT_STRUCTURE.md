# Estrutura do Projeto — fut-app

Resumo rápido
- Projeto React Native (Expo) com organização modular por telas, estilos e dados.

Visão geral (top-level)
- `App.js`, `index.js`, `app.json`, `package.json` — pontos de entrada e config do app.
- `docs/` — documentação do projeto (este arquivo).
- `src/` — código-fonte principal.

Pasta `src/` (principais subpastas)
- `assets/` — imagens, fontes e outros binários estáticos.
- `components/` — componentes reutilizáveis (botões, cards, inputs, badges etc.).
- `contexts/` — providers/contexts do app (ex.: `CartContext`, `SubscriptionContext`).
- `data/` — dados e constantes organizadas por área (ex.: `dataHome.js`, `produtos.js`).
  - Convenção: quando uma tela tem dados próprios, criamos `src/data/data<Screen>.js`.
- `navigation/` — rotas, stacks e abas (ex.: `routes.js`, `stacks/`, `tabs/`).
- `screens/` — telas da aplicação (cada arquivo é uma tela React Native).
  - Convenção de migração: estilos extraídos para `src/styles/style<Screen>/` e dados para `src/data/data<Screen>.js`.
- `services/` — integrações com APIs (ex.: `api.js`).
- `styles/` — estilos organizados por área/tela.
  - Ex.: `src/styles/stylePerfil/stylePerfil.js`, `src/styles/styleLoja/styleCards.js`.
  - Utilitário de tipografia: `src/utils/fontScale.js` (função `scaleFont`) é usada para fontes responsivas.
- `utils/` — utilitários e helpers (geralmente funções puras).

Padrões e convenções
- Cada tela idealmente importa apenas `styles` e `data` específicos, e não define grandes blocos `StyleSheet.create` inline.
- Names: `stylesPerfil` exportado de `src/styles/stylePerfil/stylePerfil.js` e `colorsPerfil` / `dataPerfil` de `src/data/dataPerfil.js`.
- Tipografia responsiva: use `scaleFont(n)` para tamanhos de fonte nos arquivos de estilo.
- Componentes genéricos vão em `src/components/` e recebem `style` e `textStyle` como props quando aplicável.

Como adicionar uma nova tela (resumido)
1. Criar `src/screens/NovaTela.js` com a lógica UI.
2. Criar `src/styles/styleNovaTela/styleNovaTela.js` exportando `styles` (usar `scaleFont`).
3. Se houver constantes/dados, criar `src/data/dataNovaTela.js` e exportar nomes claros.
4. Importar `styles` e `data` na tela e remover `StyleSheet.create` inline longo.

Onde procurar rapidamente
- Telas: `src/screens/`
- Estilos por tela: `src/styles/style<Nome>/`
- Dados por tela: `src/data/data<Nome>.js`

Observações finais
- O repositório já segue a convenção de extração de estilos/dados; mantenha patches pequenos e execute checagens de sintaxe após mudanças (`get_errors`).
- Para dúvidas sobre uma pasta específica, abra o arquivo correspondente em `src/` e posso gerar documentação mais detalhada.

**Exemplo Visual da Estrutura**

Uma visão em árvore (ilustrativa) para facilitar a navegação:

```
fut-app/
├─ App.js
├─ index.js
├─ package.json
├─ docs/
│  └─ PROJECT_STRUCTURE.md
├─ src/
│  ├─ assets/
│  │  ├─ fonts/
│  │  └─ images/
│  ├─ components/
│  │  ├─ CardGlass.js
│  │  └─ CustomButton.js
│  ├─ contexts/
│  │  ├─ CartContext.js
│  │  └─ SubscriptionContext.js
│  ├─ data/
│  │  ├─ dataHome.js
│  │  ├─ dataSocios.js
│  │  └─ dataDetalhesProdutos.js
│  ├─ navigation/
│  │  ├─ routes.js
│  │  └─ stacks/
│  ├─ screens/
│  │  ├─ HomeScreen.js
│  │  ├─ DetalhesProdutosScreens.js
│  │  └─ CarrinhosScreen.js
│  ├─ services/
│  │  └─ api.js
│  ├─ styles/
│  │  ├─ styleDetalhesProdutos/
│  │  │  └─ styleDetalhesProdutos.js
│  │  └─ styleCarrinhos/
│  │     └─ styleCarrinhos.js
│  └─ utils/
│     └─ fontScale.js
```

Este diagrama é apenas um exemplo — nem todos os arquivos/sous-pastas aparecem, use-o como referência rápida.
