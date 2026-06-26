# Plano de Alinhamento Frontend × Banco de Dados (App Cliente)

**Objetivo:** levar o frontend React Native do estado atual (dados mockados/localStorage) para consumo integral da API Django, focado no usuário final (cliente/usuário), com biometria, carrinho, compras de produtos e ingressos, e perfil pessoal.

---

## Estado atual do frontend

| Módulo | Telas/serviços existentes | Fonte de dados atual |
|---|---|---|
| Home | `HomeScreen.js` | mock em `dataHeroSlide.js` |
| Loja | `LojaScreens.js`, `DetalhesProdutosScreens.js` | mocks locais |
| Carrinho | `CarrinhosScreen.js` | estado local via `CartContext` |
| Ingressos | `IngressosScreen.js` | `dataIngresso.js` (mock) |
| Sócios | `SociosScreen.js` | dado fixo |
| Autenticação | `LoginScreen.js` (+ biometria), `CadastroScreen.js` | localStorage |
| Recuperação de senha | `EsqueceuSenhaScreen.js`, `VerificarCodigoScreens.js`, `NovaSenhaScreen.js` | sem integração |
| Perfil | `PerfilScreen.js` | estado local |
| Gamificação | *(trilha frontend ausente)* | *(ausente)* |

---

## Escopo do app (cliente-only)

- **Perfil do cliente**: dados pessoais, plano de sócio, ranking, títulos.
- **Loja**: produtos por categoria, busca, filtros, favoritos.
- **Ingressos**: jogos da temporada com setores e preços.
- **Carrinho + Checkout**: fluxo completo com pedido e compra.
- **Autenticação**: login/senha com biometria (expo-local-authentication já presente).
- **Recuperação de senha**: código SMS/e-mail com verificação.

Não entrará neste app: área de funcionários/staff (será outro sistema).

---

## Mapeamento Banco × Frontend

| Tabela | Modelo Django | ViewSet | Tela/serviço frontend | Status |
|---|---|---|---|---|
| `categoria_produtos` | `CategoriaProdutos` | `CategoriaProdutosViewSet` | `LojaScreens` (filtros), `Home` (categorias) | pendente |
| `produtos` | `Produtos` | `ProdutosViewSet` | `LojaScreens`, `DetalhesProdutosScreens` | pendente |
| `imagem_produto` | `ImagemProduto` | `ImagemProdutoViewSet` | detalhes do produto (galeria) | pendente |
| `categoria_cliente` | `CategoriaCliente` | `CategoriaClienteViewSet` | `SociosScreen`, perfil do cliente | pendente |
| `clientes` | `Clientes` | `ClientesViewSet` | `PerfilScreen`, checkout | pendente |
| `accounts_perfil` | `Perfil` | `PerfilViewSet` | `PerfilScreen` | pendente |
| `endereco_cliente` | `EnderecoCliente` | `EnderecoClienteViewSet` | tela de endereços / checkout | a criar |
| `pedido` | `Pedido` | `PedidoViewSet` | `PedidosScreen` (histórico) | a criar |
| `compra` | `Compra` | `CompraViewSet` | itens do pedido | a criar |
| `jogos` | `Jogos` | `JogosViewSet` | `IngressosScreen` | pendente |
| `times` | `Times` | `TimesViewSet` | `IngressosScreen` | pendente |
| `questoes` | `Questoes` | `QuestoesViewSet` | tela Quiz | a criar |
| `alternativas` | `Alternativas` | ligado a Questoes | tela Quiz | a criar |
| `respostas` | `Respostas` | `RespostasViewSet` | tela Quiz (envio) | a criar |
| `progresso_fases` | `ProgressoFases` | `ProgressoFasesViewSet` | perfil / tela Gamificação | a criar |
| `historico_titulos` | `HistoricoTitulos` | `HistoricoTitulosViewSet` | perfil / tela de títulos | a criar |
| `titulos` | `Titulos` | `TitulosViewSet` | tela Gamificação | a criar |
| `recuperacao_senha` | `RecuperacaoSenha` | `RecuperacaoSenhaViewSet` | fluxo de recuperação | pendente |

---

## Plano de ação por módulo

### 1) Biometria + Autenticação
- [ ] Backend: endpoints de login (email+senha → token), cadastro, logout, refresh token, `me/`.
- [ ] Frontend:
  - [ ] `LoginScreen.js`: integrar chamada a `/api/auth/token/` e salvar token no SecureStore + `global.userToken`.
  - [ ] Fluxo de biometria: se usuário já logou antes, oferecer "Entrar com biometria" (como já existe no layout) usando `expo-local-authentication`.
  - [ ] `CadastroScreen.js`: integrar com `/api/auth/register/` criando `User` + `Clientes` + `accounts_perfil`.
  - [ ] Interceptor 401 no `api.js` redireciona para Login.

### 2) Perfil do cliente
- [ ] Backend: `PerfilViewSet`, `ClientesViewSet` (somente próprio usuário).
- [ ] Frontend:
  - [ ] `PerfilScreen.js`: carregar dados de `/api/perfil/me/` e `/api/clientes/me/`.
  - [ ] Mostrar plano/socio, nome, email, ranking, títulos, progresso do quiz.
  - [ ] Permitir edição de dados pessoais e endereço.

### 3) Catálogo (Loja em destaque + Categorias)
- [ ] Backend: `CategoriaProdutosViewSet`, `ProdutosViewSet`, `ImagemProdutoViewSet`.
- [ ] Frontend:
  - [ ] Substituir mocks de `dataHeroSlide.js` por `/api/produtos/?ordering=-id&page_size=5`.
  - [ ] Conectar `LojaScreens.js` a `/api/produtos/` e `/api/categorias-produtos/`.
  - [ ] Conectar `DetalhesProdutosScreens.js` a `/api/produtos/{id}/` e `/api/imagens-produto/`.

### 4) Ingressos
- [ ] Backend: `JogosViewSet`, `TimesViewSet`.
- [ ] Frontend:
  - [ ] `IngressosScreen.js`: substituir `dataIngresso.js` por `/api/jogos/` + `/api/times/`.
  - [ ] Garantir que os campos usados (`dia`, `hora`, `local`, `casa`, `times`) vem do serializer do backend.

### 5) Carrinho + Checkout
- [ ] Backend:
  - [ ] ViewSets para `Pedido` e `Compra`.
  - [ ] Endpoint para fechar pedido (transação: cria `Pedido` + linhas em `Compra`, abate estoque em `Produtos`).
- [ ] Frontend:
  - [ ] `CarrinhosScreen.js`: ao clicar "Comprar", enviar itens para `/api/pedidos/` e limpar carrinho local.
  - [ ] Criar `PedidosScreen.js` para listar histórico de pedidos do cliente.

### 6) Endereços
- [ ] Backend: `EnderecoClienteViewSet` (CRUD do cliente autenticado).
- [ ] Frontend:
  - [ ] Tela `EnderecosScreen.js` (listar, criar, editar, remover).
  - [ ] Selecionar endereço no checkout.

### 7) Recuperação de senha
- [ ] Backend: `RecuperacaoSenhaViewSet` (criar código, validar, redefinir).
- [ ] Frontend:
  - [ ] `EsqueceuSenhaScreen.js` → solicitar código (`/api/recuperacao-senha/`).
  - [ ] `VerificarCodigoScreens.js` → validar código.
  - [ ] `NovaSenhaScreen.js` → redefinir senha.

### 8) Gamificação (Quiz) — opcional no MVP
- [ ] Backend: serializers e viewsets para questões, alternativas, respostas, progresso e títulos.
- [ ] Lógica de correção no backend (atualiza `total_acertos`, `total_questoes`, `precisao`, `score_rank`).
- [ ] Frontend:
  - [ ] Tela `QuizScreen.js` e `GamificacaoScreen.js`.
  - [ ] Mostrar no perfil: progresso e títulos conquistados.

---

## Ordem recomendada de implementação

1. **Autenticação + biometria** (Login/Cadastro/SecureStore, base para todo o resto).
2. **Catálogo** (loja visível, destaque e categorias).
3. **Ingressos** (tela já pronta, trocar mock por API).
4. **Carrinho + Checkout + Endereços** (fluxo de compra completo produtos + ingressos).
5. **Perfil** (dados do cliente, endereços, histórico).
6. **Recuperação de senha**.
7. **Quiz/Gamificação** (módulo novo, pode vir depois).

---

## Critérios de aceite

- [ ] Todos os `fields` dos serializers coincidem com o que o frontend consome.
- [ ] Listagens suportam paginação default (DRF retorna `results`).
- [ ] Filtros e ordenação funcionam (`categoria_produtos`, `search`, `ordering`).
- [ ] Erros 401 redirecionam para login; 403 com mensagem amigável.
- [ ] Toda criação/edição retorna o objeto atualizado.
- [ ] Carrinho local é substituído por pedido real no backend.
- [ ] Estoque é abatido no backend, não no frontend.
- [ ] Biometria é usada apenas para retomar login; senha continua sendo validada no backend.
- [ ] Testado no Swagger antes de integrar no React Native.
