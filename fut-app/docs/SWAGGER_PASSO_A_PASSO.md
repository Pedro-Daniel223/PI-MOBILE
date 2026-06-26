# Swagger no Fut-App — Passo a Passo

Este guia cobre a configuração e o uso do **Swagger (drf-yasg)** na API Django do `fut-app`, alinhado às tabelas do banco `projeto_futebol_definitivo`.

---

## 1) Pré-requisitos

- Python 3.10+
- Projeto Django com apps: `app_futebol`, `accounts`, `minigame`
- Banco já criado (`projeto_futebol_definitivo`) com as tabelas do SQL definitivo

---

## 2) Instale as dependências

```powershell
cd C:\Users\10744196\Desktop\PI-MOBILE\fut-app\backend
pip install djangorestframework drf-yasg django-filter
```

---

## 3) Configure `settings.py`

Adicione em `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "drf_yasg",
    "django_filters",
    "app_futebol",
    "accounts",
    "minigame",
]
```

Adicione as configurações do DRF e CORS:

```python
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8081",   # Expo Go (frontend)
    "http://localhost:19006",  # Web (frontend)
]
```

---

## 4) Configure as URLs raiz

Edite `urls.py` da raiz do projeto Django:

```python
from django.contrib import admin
from django.urls import path, re_path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="API Fut-App",
        default_version="v1",
        description="API backend do aplicativo Fut-App.",
        contact=openapi.Contact(email="contato@fut-app.com.br"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path("api/", include("app_futebol.urls")),  # ajuste: inclua cada app aqui
    path("swagger(.json|.yaml)$", schema_view.without_ui(cache_timeout=0), name="schema-json"),
]
```

> **Importante:** se houver outros apps com endpoints (`accounts`, `minigame`), adicione `path("api/", include("accounts.urls"))` e `path("api/", include("minigame.urls"))` conforme criá-los.

---

## 5) Crie os serializers e viewsets

Exemplo mínimo para `app_futebol/serializers.py`:

```python
from rest_framework import serializers
from .models import CategoriaProdutos, Produtos, Jogos, Times

class CategoriaProdutosSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaProdutos
        fields = ["id_CATEGORIA_PRODUTOS", "nome_CATEGORIA_PRODUTOS"]

class ProdutosSerializer(serializers.ModelSerializer):
    categoria_nome = serializers.CharField(source="CATEGORIA_PRODUTOS.nome_CATEGORIA_PRODUTOS", read_only=True)

    class Meta:
        model = Produtos
        fields = [
            "id_PRODUTOS",
            "nome_PRODUTOS",
            "valor_PRODUTOS",
            "descricao_PRODUTOS",
            "quantidade_estoque_PRODUTOS",
            "CATEGORIA_PRODUTOS",
            "categoria_nome",
            "imagem_PRODUTOS",
            "jogos_id_jogos",
        ]

class JogosSerializer(serializers.ModelSerializer):
    time_nome = serializers.CharField(source="times_id_times.nome_time", read_only=True)
    time_brasao = serializers.CharField(source="times_id_times.url_brasao", read_only=True)

    class Meta:
        model = Jogos
        fields = [
            "id_jogos",
            "dia_jogo",
            "hora_jogo",
            "local_jogo",
            "casa_fora",
            "times_id_times",
            "time_nome",
            "time_brasao",
        ]

class TimesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Times
        fields = ["id_times", "nome_time", "url_brasao"]
```

Exemplo mínimo para `app_futebol/views.py`:

```python
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import CategoriaProdutos, Produtos, Jogos, Times
from .serializers import CategoriaProdutosSerializer, ProdutosSerializer, JogosSerializer, TimesSerializer

class CategoriaProdutosViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CategoriaProdutos.objects.all().order_by("nome_CATEGORIA_PRODUTOS")
    serializer_class = CategoriaProdutosSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["nome_CATEGORIA_PRODUTOS"]

class ProdutosViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Produtos.objects.all()
    serializer_class = ProdutosSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["CATEGORIA_PRODUTOS"]
    search_fields = ["nome_PRODUTOS", "descricao_PRODUTOS"]
    ordering_fields = ["valor_PRODUTOS", "nome_PRODUTOS"]

class JogosViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Jogos.objects.select_related("times_id_times").all()
    serializer_class = JogosSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["dia_jogo", "hora_jogo"]

class TimesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Times.objects.all()
    serializer_class = TimesSerializer
```

---

## 6) Crie as URLs do app

`app_futebol/urls.py`:

```python
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CategoriaProdutosViewSet, ProdutosViewSet, JogosViewSet, TimesViewSet

router = DefaultRouter()
router.register(r"categorias-produtos", CategoriaProdutosViewSet, basename="categoria-produtos")
router.register(r"produtos", ProdutosViewSet, basename="produtos")
router.register(r"jogos", JogosViewSet, basename="jogos")
router.register(r"times", TimesViewSet, basename="times")

urlpatterns = router.urls
```

---

## 7) Execute o servidor

```powershell
cd C:\Users\10744196\Desktop\PI-MOBILE\fut-app\backend
python manage.py runserver
```

- API + Swagger UI: `http://localhost:8000/`
- JSON da spec: `http://localhost:8000/swagger.json`
- YAML da spec: `http://localhost:8000/swagger.yaml`

---

## 8) Documente endpoints customizados

Para endpoints que não são ViewSets (ex.: login, recuperação de senha), use `@swagger_auto_schema`.

Exemplo para login (`accounts/views.py` ou outro app):

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.authtoken.models import Token

@swagger_auto_schema(
    method="post",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=["email", "password"],
        properties={
            "email": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_EMAIL),
            "password": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_PASSWORD),
        },
    ),
    responses={
        200: openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "token": openapi.Schema(type=openapi.TYPE_STRING),
                "user_id": openapi.Schema(type=openapi.TYPE_INTEGER),
            },
        ),
        400: "Credenciais inválidas",
    },
)
@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")
    user = User.objects.filter(email=email).first()
    if not user or not user.check_password(password):
        return Response({"detail": "Credenciais inválidas."}, status=400)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key, "user_id": user.id})
```

---

## 9) Testando no Swagger UI

1. Abra `http://localhost:8000/` no navegador.
2. Clique em um endpoint (ex.: `GET /api/produtos/`).
3. Clique em **Try it out**.
4. Preencha parâmetros se houver (ex.: `categoria_produtos`, `search`).
5. Clique em **Execute** e veja a resposta no painel **Response body**.

> Para endpoints protegidos (autenticação por token):
> 1. Clique na seta **Authorize** no topo da página.
> 2. Cole o token no formato: `Token SEU_TOKEN_AQUI`
> 3. Clique em **Authorize** e feche.

---

## 10) Integrando com o frontend React Native

Após testar no Swagger, atualize `src/services/api.js` (veja `API.md` seção 4.1) e substitua os mocks por chamadas HTTP.

Exemplo para substituir `dataHeroSlide.js`:

```javascript
// src/data/dataHeroSlide.js
import { api } from "../../services/api";

export async function fetchProdutosDestaque() {
  const { data } = await api.get("/produtos/", {
    params: { ordering: "-id_PRODUTOS", page_size: 5 },
  });
  return data.results ?? data;
}
```

Exemplo para categorias:

```javascript
export async function fetchCategorias() {
  const { data } = await api.get("/categorias-produtos/", {
    params: { ordering: "nome_CATEGORIA_PRODUTOS" },
  });
  return data.results ?? data;
}
```

---

## 11) Fluxo de trabalho recomendado

1. Crie um serializer + viewset no Django.
2. Adicione a rota em `urls.py`.
3. Execute `python manage.py runserver`.
4. Abra o Swagger e teste o endpoint manualmente.
5. Ajuste campos até a resposta ficar correta.
6. Só então implemente o consumo no React Native.

Isso evita refatoração dupla (backend + frontend ao mesmo tempo).

---

## 12) Dicas

- O Swagger UI **não** aplica automaticamente a lista de permissões do DRF; endpoints com `AllowAny` aparecem sem botão **Authorize**.
- Use `permission_classes=[permissions.AllowAny]` apenas em endpoints públicos (login, recuperação de senha).
- Viewsets de leitura (`ReadOnlyModelViewSet`) já são documentadas automaticamente se o serializer estiver definido.
- Para campos `choices` (ex.: `casa_fora` em `jogos`), o Swagger mostra os valores possíveis no schema.
