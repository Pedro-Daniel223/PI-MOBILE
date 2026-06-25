# Documentação da API — fut-app

## Visão geral

Este documento descreve como integrar o **frontend React Native (Expo)** do `fut-app` com uma **API Django** exposta via **Django REST Framework**, utilizando **Swagger (drf-yasg)** para documentação.

Em produção, substitua `http://localhost:8000` pelo domínio real da API (ex.: `https://api.fut-app.com.br`).

---

## 1) Configuração do Backend (Django)

### 1.1 Dependências

Instale os pacotes:

```bash
pip install djangorestframework drf-yasg
```

### 1.2 `settings.py`

```python
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # --- apps do projeto ---
    "rest_framework",
    "drf_yasg",
    # seus apps aqui: "loja", "usuarios", etc.
]

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
    "http://localhost:8081",   # Expo Go
    "http://localhost:19006",  # Web
]
```

### 1.3 `urls.py` (raiz do projeto)

```python
from django.contrib import admin
from django.urls import path, re_path
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
    # Redirect raiz para o Swagger
    path("", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    # Endpoints da API
    path("api/", include("loja.urls")),
    path("api/", include("usuarios.urls")),
    # Documentação OpenAPI (JSON/YAML)
    re_path(r"^swagger(?P<format>\.json|\.yaml)$", schema_view.without_ui(cache_timeout=0), name="schema-json"),
]
```

### 1.4 Modelos, Views, Serializers e URLs

```python
# loja/serializers.py
from rest_framework import serializers
from .models import Categoria, Produto

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ["id", "nome", "slug", "imagem", "ordem"]

class ProdutoSerializer(serializers.ModelSerializer):
    categoria_nome = serializers.CharField(source="categoria.nome", read_only=True)

    class Meta:
        model = Produto
        fields = ["id", "nome", "descricao", "preco", "imagem", "categoria", "categoria_nome"]
```

```python
# loja/views.py
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Categoria, Produto
from .serializers import CategoriaSerializer, ProdutoSerializer

class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ["slug"]
    ordering_fields = ["ordem", "nome"]

class ProdutoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["categoria"]
    search_fields = ["nome", "descricao"]
    ordering_fields = ["preco", "nome"]
```

```python
# loja/urls.py
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, ProdutoViewSet

router = DefaultRouter()
router.register(r"categorias", CategoriaViewSet, basename="categoria")
router.register(r"produtos", ProdutoViewSet, basename="produto")

urlpatterns = router.urls
```

### 1.5 Acessando o Swagger

- Interface visual: `http://localhost:8000/`
- JSON OpenAPI: `http://localhost:8000/swagger.json`
- YAML OpenAPI: `http://localhost:8000/swagger.yaml`

---

## 2) Integração no Frontend (React Native)

### 2.1 Configuração base (`src/services/api.js`)

```javascript
import Axios from "axios";

export const API_BASE_URL = __DEV__
  ? "http://localhost:8000/api"
  : "https://api.fut-app.com.br/api";

export const api = Axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = global.userToken; // use seu estado global / SecureStore
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // redirecionar para login
    }
    return Promise.reject(error);
  }
);
```

### 2.2 Endpoints consumidos pelo app

#### Produtos em destaque (Hero Slider)

```javascript
// src/data/dataHeroSlide.js
import { api } from "../../services/api";

export async function fetchProdutosDestaque() {
  const { data } = await api.get("/produtos/", {
    params: { ordering: "-id", page_size: 5 },
  });
  return data.results ?? data;
}
```

#### Categorias

```javascript
// src/data/dataHeroSlide.js
export async function fetchCategorias() {
  const { data } = await api.get("/categorias/", {
    params: { ordering: "ordem" },
  });
  return data.results ?? data;
}
```

#### Detalhes do produto

```javascript
// src/screens/DetalhesProdutosScreens.js
import { api } from "../../services/api";

export async function fetchProduto(slug) {
  const { data } = await api.get(`/produtos/${slug}/`);
  return data;
}
```

#### Login (Token authentication)

```javascript
// src/screens/LoginScreen.js
import { api } from "../../services/api";

export async function login(email, password) {
  const response = await api.post("/auth/token/", {
    email,
    password,
  });
  return response.data.token;
}
```

#### Recuperação de senha

```javascript
// src/screens/EsqueceuSenhaScreen.js
export async function solicitarRecuperacao(email) {
  await api.post("/auth/password/reset/", { email });
}

// src/screens/VerificarCodigoScreens.js
export async function verificarCodigo(codigo) {
  await api.post("/auth/password/verify/", { codigo });
}

export async function redefinirSenha(codigo, novaSenha) {
  await api.post("/auth/password/confirm/", { codigo, novaSenha: novaSenha });
}
```

---

## 3) Exemplo de View compatível com Swagger

```python
# usuarios/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class TokenResponseSerializer(serializers.Serializer):
    token = serializers.CharField()

# usuarios/views.py
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from .serializers import LoginSerializer, TokenResponseSerializer

@swagger_auto_schema(
    method="post",
    request_body=LoginSerializer,
    responses={200: TokenResponseSerializer, 400: "Credenciais inválidas"},
)
@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = User.objects.filter(
        email=serializer.validated_data["email"]
    ).first()
    if not user or not user.check_password(serializer.validated_data["password"]):
        return Response({"detail": "Credenciais inválidas."}, status=400)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key})
```

### Équivalentes para ViewSets

```python
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class ProdutoViewSet(viewsets.ReadOnlyModelViewSet):
    ...
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter("categoria", openapi.IN_QUERY, type=openapi.TYPE_INTEGER),
            openapi.Parameter("search", openapi.IN_QUERY, type=openapi.TYPE_STRING),
        ],
        responses={200: ProdutoSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
```

---

## 4) Testando a API antes de consumir no app

1. Execute o servidor Django: `python manage.py runserver`
2. Abra `http://localhost:8000/`
3. Teste endpoints diretamente no Swagger UI antes de implementar no React Native.
4. Copie a resposta de exemplo para criar o mock em `src/data/data<NomeTela>.js`.

---

## 5) Estrutura esperada

```
backend/
├─ manage.py
├─ projeto/
│  ├─ settings.py
│  └─ urls.py
├─ loja/
│  ├─ models.py
│  ├─ serializers.py
│  ├─ views.py
│  └─ urls.py
└─ usuarios/
   ├─ serializers.py
   └─ views.py
```

---

## 6) Boas práticas

- Nunca commite `SECRET_KEY` ou credenciais.
- Use HTTPS em produção.
- Tokens expiram? Implemente `/auth/token/refresh/`.
- Versionar a API (`/api/v1/`) planejando atualizações.
- Documente novos endpoints com `@swagger_auto_schema`.
- Garanta que os dados do serializer coincidam com o que o app espera.
