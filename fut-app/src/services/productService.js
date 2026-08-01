import apiClient, { get } from './api';

const { BASE_URL } = apiClient;

console.log('[productService] BASE_URL =', BASE_URL);

const formatCurrencyBRL = (value) =>
  Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const extractListPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
};

const extractImagePath = (image) => {
  if (!image) {
    return null;
  }

  if (typeof image === 'string') {
    return image;
  }

  if (typeof image === 'object') {
    return (
      image.url_imagem_produtos ??
      image.url ??
      image.imagem ??
      image.image ??
      image.path ??
      image.src ??
      null
    );
  }

  return null;
};

const buildImageUrl = (path) => {
  if (!path) {
    console.log('[productService] buildImageUrl skipped: empty path');
    return null;
  }

  const rawPath = String(path).trim();

  if (!rawPath) {
    console.log('[productService] buildImageUrl skipped: blank path');
    return null;
  }

  if (/^https?:\/\//i.test(rawPath) || rawPath.startsWith('data:')) {
    console.log('[productService] image url preserved as absolute', {
      rawPath,
    });
    return rawPath;
  }

  console.log('[productService] image url preserved as raw value', {
    rawPath,
  });
  return rawPath;
};

const normalizeImages = (produto = {}) => {
  const imageFromApi = buildImageUrl(
    produto.url_imagem_produtos ?? produto.imagem_produtos ?? produto.image ?? produto.imagem,
  );

  if (Array.isArray(produto.imagens) && produto.imagens.length > 0) {
    return produto.imagens
      .map((image) => buildImageUrl(extractImagePath(image)) || extractImagePath(image))
      .filter(Boolean);
  }

  if (Array.isArray(produto.images) && produto.images.length > 0) {
    return produto.images
      .map((image) => buildImageUrl(extractImagePath(image)) || extractImagePath(image))
      .filter(Boolean);
  }

  return imageFromApi ? [imageFromApi] : [];
};

const normalizeProduct = (produto = {}, index = 0) => {
  const id = String(produto.id_produtos ?? produto.id ?? produto.product_id ?? index + 1);
  const nome = produto.nome_produtos ?? produto.nome ?? produto.name ?? produto.title ?? 'Produto';
  const precoFinal = Number(
    produto.preco_final ??
    produto.preco_final_unitario ??
    produto.preco_produtos ??
    produto.valor_produtos ??
    produto.preco ??
    produto.price ??
    0
  );
  const precoOriginal = Number(
    produto.preco_original ??
    produto.preco_original_unitario ??
    produto.valor_produtos ??
    produto.preco_produtos ??
    produto.price ??
    0
  );
  const economia = Number(
    produto.economia ??
    produto.economia_unitaria ??
    Math.max(precoOriginal - precoFinal, 0)
  );
  const estoque = Number(produto.estoque_produtos ?? produto.quantidade_estoque_produtos ?? 0);
  const descricao = produto.descricao_produtos ?? produto.descricao ?? produto.description ?? '';
  const categoria =
    produto.categoria_produtos ??
    produto.categoria ??
    produto.category ??
    produto.cat ??
    'Camisa';
  const imagens = normalizeImages(produto);
  const imagem = imagens[0] ?? buildImageUrl(produto.url_imagem_produtos ?? produto.imagem_produtos ?? produto.image ?? produto.imagem);
  const status =
    produto.status_produtos !== undefined && produto.status_produtos !== null
      ? Number(produto.status_produtos)
      : estoque > 0
        ? 1
        : 0;
  const descontoPercent = Number(produto.desconto_percent ?? produto.desconto ?? 0);
  const desconto = descontoPercent ? `${descontoPercent}%` : (produto.desconto ?? produto.tag ?? '');

  return {
    id,
    nome,
    title: produto.title ?? nome,
    name: produto.name ?? nome,
    preco: precoFinal,
    price: precoFinal,
    priceDisplay: formatCurrencyBRL(precoFinal),
    precoOriginal,
    preco_original: precoOriginal,
    precoAntigo: precoOriginal,
    oldPrice: precoOriginal,
    oldPriceDisplay: formatCurrencyBRL(precoOriginal),
    precoFinal,
    preco_final: precoFinal,
    finalPrice: precoFinal,
    finalPriceDisplay: formatCurrencyBRL(precoFinal),
    economia,
    economiaDisplay: formatCurrencyBRL(economia),
    economia_display: formatCurrencyBRL(economia),
    descontoPercent,
    desconto_percent: descontoPercent,
    desconto,
    tag: produto.tag ?? desconto,
    categoria,
    category: categoria,
    cat: produto.cat ?? categoria,
    imagens,
    images: imagens,
    imagem,
    image: imagem,
    descricao,
    description: descricao,
    estoque,
    estoque_produtos: estoque,
    status_produtos: status,
    url_imagem_produtos: produto.url_imagem_produtos ?? produto.imagem_produtos ?? null,
    beneficios_plano: produto.beneficios_plano ?? [],
    plano_atual: produto.plano_atual ?? null,
    imagens,
  };
};

let cachedProducts = null;

export const listarProdutos = async () => {
  const payload = await get('/api/produtos/');
  const produtos = extractListPayload(payload).map((produto, index) => normalizeProduct(produto, index));

  console.log('[productService] listarProdutos', {
    total: produtos.length,
    firstImages: produtos.slice(0, 3).map((produto) => ({
      id: produto.id,
      url_imagem_produtos: produto.url_imagem_produtos,
      image: produto.image,
    })),
  });

  cachedProducts = produtos;
  return produtos;
};

export const buscarProduto = async (id) => {
  if (id === undefined || id === null || id === '') {
    return null;
  }

  const cachedProduct = cachedProducts?.find((product) => String(product.id) === String(id));
  if (cachedProduct) {
    return cachedProduct;
  }

  const payload = await get(`/api/produtos/${id}/`);
  if (!payload) {
    return null;
  }

  return normalizeProduct(payload);
};

export const loadProducts = listarProdutos;

export const getProductById = buscarProduto;

export const getCachedProducts = () => cachedProducts || [];

export default {
  listarProdutos,
  buscarProduto,
  loadProducts,
  getProductById,
  getCachedProducts,
};
