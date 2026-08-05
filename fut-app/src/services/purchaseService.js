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

export const fetchPurchaseHistory = async (token) => {
  const payload = await get("/api/minhas-compras/", token);
  const pedidos = Array.isArray(payload?.pedidos) ? payload.pedidos : extractListPayload(payload);

  return pedidos.map((pedido) => {
    const itens = Array.isArray(pedido.itens) ? pedido.itens : [];
    const primeiroItem = itens[0] || {};

    return {
      id: `pedido-${pedido.id_pedido ?? primeiroItem.id_compra ?? Math.random()}`,
      type: "purchase",
      items: itens.map((it) => ({
        id_compra: it.id_compra ?? null,
        produto_id: it.produto_id ?? null,
        produto_nome: it.produto_nome || "Produto",
        produto_imagem: resolveImageSource(it.produto_imagem),
        quantidade: Number(it.quantidade || 1),
        tamanho: it.tamanho || "",
        valor: Number(it.valor || 0),
        subtotal: Number(it.subtotal || 0),
      })),
      itemImages: itens
        .map((it) => resolveImageSource(it.produto_imagem))
        .filter(Boolean),
      price: formatBRL(pedido.valor_total ?? 0),
      date: pedido.data_pedido ?? null,
      status: pedido.status ?? "",
      quantity: Number(pedido.quantidade_total ?? itens.reduce((sum, it) => sum + Number(it.quantidade || 0), 0)),
      size: itens.find((it) => it.tamanho)?.tamanho || "",
      productName: primeiroItem.produto_nome || "Produto",
      productImage: resolveImageSource(primeiroItem.produto_imagem),
      rawValue: Number(pedido.valor_total ?? 0),
      id_pedido: pedido.id_pedido ?? primeiroItem.id_compra ?? null,
    };
  });
};

export const getPurchaseDetails = (purchases, purchaseId) => {
  if (!Array.isArray(purchases) || purchaseId == null) {
    return null;
  }

  return (
    purchases.find((purchase) => purchase.id_pedido === purchaseId) ||
    purchases.find((purchase) => purchase.id === purchaseId) ||
    null
  );
};

export default {
  fetchPurchaseHistory,
  getPurchaseDetails,
};
