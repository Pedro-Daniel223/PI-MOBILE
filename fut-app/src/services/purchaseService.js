import apiClient, { get } from "./api";

const { BASE_URL } = apiClient;

const extractListPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
};

const resolveImageSource = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "object" && value.uri) {
    return value;
  }

  const rawPath = String(value).trim();
  if (!rawPath) {
    return null;
  }

  if (/^https?:\/\//i.test(rawPath)) {
    return { uri: rawPath };
  }

  const normalizedBaseUrl = String(BASE_URL || "").replace(/\/+$/, "");
  const normalizedPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

  try {
    return { uri: new URL(normalizedPath, normalizedBaseUrl).toString() };
  } catch {
    return { uri: `${normalizedBaseUrl}${normalizedPath}` };
  }
};

const formatBRL = (value) =>
  Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const normalizePurchase = (item = {}) => {
  const produtoNome =
    item.produto_nome ??
    item.nome_produto ??
    item.produtos?.nome_produtos ??
    "Produto";
  const produtoImagem =
    resolveImageSource(
      item.produto_imagem ??
        item.imagem_produto ??
        item.produtos?.imagem_produtos,
    ) ?? null;
  const quantidade = Number(item.quantidade ?? item.quantidade_pedido ?? 1);
  const valor = Number(item.valor ?? item.valor_compra ?? 0);
  const dataPedido = item.data_pedido ?? item.pedido?.data_pedido ?? null;
  const statusPedido = item.status_pedido ?? item.pedido?.status ?? "";
  const tamanho = item.tamanho ?? "";

  return {
    id: `compra-${item.id_compra ?? item.id ?? Math.random()}`,
    type: "purchase",
    items: [produtoNome],
    itemImages: produtoImagem ? [produtoImagem] : [],
    price: formatBRL(valor),
    date: dataPedido,
    status: statusPedido,
    quantity: quantidade,
    size: tamanho,
    productName: produtoNome,
    productImage: produtoImagem,
    rawValue: valor,
  };
};

export const fetchPurchaseHistory = async (token) => {
  const payload = await get("/api/compras/", token);
  return extractListPayload(payload).map(normalizePurchase);
};

export default {
  fetchPurchaseHistory,
};
