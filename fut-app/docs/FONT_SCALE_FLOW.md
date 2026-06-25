# Fluxo da Escala de Fonte — Loja (`LojaScreens`)

## Visão geral

A escala de fonte na tela de loja é responsável por adaptar tipografia a diferentes tamanhos de tela e configurações de acessibilidade do usuário (fontScale do sistema). O cálculo combina:

1. **Largura física da tela** → `width / baseWidth` (base = 375px)  
2. **Fator de escala do sistema** → `PixelRatio.getFontScale()`  
3. **Clamp de segurança** → mínimo `0.85x` e máximo `1.8x` sobre o tamanho base

---

## Arquivos envolvidos

| Arquivo | Função |
|---|---|
| `src/utils/fontScale.js` | Utilitário central de escala de fonte |
| `src/screens/LojaScreens.js` | Tela de loja que aplica os estilos tipográficos |
| `src/styles/styleLoja/styleAll.js` | Design System e estilos da loja (fonts, DS) |

---

## Fluxo visual

```
┌─────────────────────────────────────────────────────────────────────┐
│  User Device Settings                                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  fontScale (ex: 1.2 em dispositivo de acessibilidade)       │  │
│  └──────────────────────┬───────────────────────────────────────┘  │
│                         │ PixelRatio.getFontScale()                │
│                         ▼                                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  fontScale.js → getFontScale()                               │  │
│  │                                                               │  │
│  │  useFontScale() (hook reativo)                               │  │
│  │    → escuta 'change' do Dimensions                            │  │
│  │    → atualiza estado quando tela é redimensionada             │  │
│  └──────────────────────┬───────────────────────────────────────┘  │
│                         │                                          │
│                         ▼                                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  scaleFont(size, fontScale, baseWidth)                       │  │
│  │                                                               │  │
│  │  1. Pega width da tela (Dimensions.get('window').width)      │  │
│  │  2. scaleFactor = width / 375                                │  │
│  │  3. scaled = size * scaleFactor * fontScale                  │  │
│  │  4. clamp: min = size * 0.85  |  max = size * 1.8           │  │
│  │  5. retorna: Math.min(max, Math.max(min, scaled))            │  │
│  └──────────────────────┬───────────────────────────────────────┘  │
│                         │                                          │
│                         ▼                                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  LojaScreens → estilos tipográficos                          │  │
│  │                                                               │  │
│  │  Exemplos de uso:                                            │  │
│  │   • heroStyles.title      (HeroCarousel)                     │  │
│  │   • heroStyles.tagText    (HeroCarousel)                     │  │
│  │   • catStyles.pillText    (CategoriasStrip)                  │  │
│  │   • cardStyles.nome       (ProductCard)                      │  │
│  │   • cardStyles.preco      (ProductCard)                      │  │
│  │   • campStyles.campaignTitle (CampaignBanner)                │  │
│  │   • adStyles.headline     (EditorialAdBanner)                │  │
│  │   • topStyles.logoText    (TopBar)                           │  │
│  │   • secStyles.tag/title   (SectionHeader)                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## API de `fontScale.js`

### `getFontScale()`
Retorna o valor atual de escala de fonte do sistema operacional via `PixelRatio.getFontScale()`.

---

### `scaleFont(size, fontScale, baseWidth)`

| Parâmetro | Tipo | Padrão | Descrição |
|---|---|---|---|
| `size` | `number` | — | Tamanho base da fonte (px lógicos) |
| `fontScale` | `number` | `getFontScale()` | Multiplicador de acessibilidade |
| `baseWidth` | `number` | `375` | Largura de referência para cálculo proporcional |

**Retorna**: `number` — tamanho final em px, clampado entre `size * 0.85` e `size * 1.8`.

---

### `useFontScale()`
Hook reativo que:
1. Inicializa com `getFontScale()`
2. Adiciona listener em `Dimensions` para evento `'change'`
3. Atualiza o estado quando a tela é redimensionada ou rotacionada
4. Remove o listener ao desmontar

---

## Dependência do Design System

O arquivo `styleAll.js` (importado como `DS`) concentra tokens visuais (cores, raios, espaçamentos, tipografia) utilizados em toda a tela de loja. A escala de fonte é aplicada diretamente nos estilos tipográficos — não há camada intermediária de theming de fonte, ou seja, os valores de `fontSize` já consideram a escala no momento da definição ou são ajustados em tempo de execução via `scaleFont()`.

---

## Pontos de atenção

- **Fontes fixas (`Ionicons`)**: Ícones vetoriais usam `size` fixo (ex: `size={14}`, `size={18}`) e **não** passam por `scaleFont()`.
- **Image resize**: Imagens usam `resizeMode="contain"` e dimensões fixas em `cardStyles.image`, sem escala dinâmica.
- **SafeAreaInsets**: `insets.top` é usado para padding superior — não afeta tipografia diretamente.
- **Clamp evita overflow**: O limite superior de `1.8x` previne que fontes gigantes quebrem o layout em dispositivos com acessibilidade extrema.

---

## Como usar em outras telas

### Padrão

1. Importar `scaleFont` de `src/utils/fontScale`.
2. Aplicar `scaleFont(tamanhoBase)` diretamente em `fontSize` dentro de `StyleSheet.create`.

### Exemplo 1 — Estilo de seção (Loja)

```js
import { StyleSheet } from 'react-native';
import { scaleFont } from '../../utils/fontScale';

export const secStyles = StyleSheet.create({
  tag: {
    fontSize: scaleFont(9),
    fontWeight: '700',
    letterSpacing: 2.5,
  },
  title: {
    fontSize: scaleFont(28),
    fontWeight: '900',
    lineHeight: scaleFont(30),
  },
  subtitle: {
    fontSize: scaleFont(12),
    fontWeight: '400',
    marginTop: 6,
  },
});
```

### Exemplo 2 — Estilo de card (Home)

```js
import { scaleFont } from '../../utils/fontScale';

export const stylesHome = StyleSheet.create({
  statusTitle: {
    fontSize: scaleFont(12),
    opacity: 0.7,
  },
  welcomeText: {
    fontSize: scaleFont(24),
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: '800',
  },
  buttonText: {
    fontSize: scaleFont(12),
  },
});
```

### Exemplo 3 — Estilo de perfil

```js
import { scaleFont } from '../../utils/fontScale';

export const stylesPerfil = StyleSheet.create({
  username: {
    fontSize: scaleFont(22),
    fontWeight: '700',
  },
  userStatus: {
    fontSize: scaleFont(13),
  },
  infoLabel: {
    fontSize: scaleFont(12),
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: scaleFont(16),
    fontWeight: '600',
  },
  logoutText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
  },
});
```

### Regras

- Sempre passe um número fixo (tamanho base) para `scaleFont` — ele devolve o valor escalado e clampado.
- Não use `scaleFont` dentro de componentes em tempo de renderização repetida; prefira definir dentro de `StyleSheet.create` para manter performance.
- Se precisar reagir a mudanças de escala em tempo real, use o hook `useFontScale()` no componente e repasse o valor para estilos dinâmicos.

