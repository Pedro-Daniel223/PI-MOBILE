import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, Image, TouchableOpacity, ScrollView,
  StatusBar, Dimensions, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import CartBadge from '../components/CartBadge';
import styles from '../styles/styleDetalhesProdutos/styleDetalhesProdutos';

const { width } = Dimensions.get('window');

const parseCurrencyValue = (value) => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return 0;
  }

  const normalized = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const extractImagePath = (image) => {
  if (!image) {
    return null;
  }

  if (typeof image === 'string') {
    return image;
  }

  if (typeof image === 'object') {
    return image.url_imagem_produtos ?? image.url ?? image.imagem ?? image.image ?? image.path ?? image.src ?? null;
  }

  return null;
};

const normalizeImages = (produto) => {
  if (Array.isArray(produto.images) && produto.images.length > 0) {
    return produto.images.map((image) => extractImagePath(image)).filter(Boolean);
  }

  if (Array.isArray(produto.imagens) && produto.imagens.length > 0) {
    return produto.imagens.map((image) => extractImagePath(image)).filter(Boolean);
  }

  if (produto.imagem) {
    return [produto.imagem];
  }

  if (produto.image) {
    return [produto.image];
  }

  return [];
};

const resolveImageSource = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return { uri: value };
  }

  return value;
};

const normalizeCategory = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const isCamisasFC = (category) => normalizeCategory(category) === 'camisas fc';

const EMPTY_PRODUCT = {
  id: '',
  nome: 'Produto',
  preco: 0,
  precoAntigo: 0,
  desconto: '',
  imagens: [],
  imagem: null,
  descricao: '',
  categoria: '',
};

export default function DetalhesProdutosScreens({ route, navigation }) {
  const { addItem, totalItems } = useCart();
  const { getProductById } = useProducts();

  const produtoEntrada = route.params?.produto ?? null;
  const produtoId = route.params?.produtoId ?? route.params?.id ?? produtoEntrada?.id ?? null;
  const [produto, setProduto] = useState(produtoEntrada ? {
    ...EMPTY_PRODUCT,
    ...produtoEntrada,
    nome: produtoEntrada.nome ?? produtoEntrada.title ?? EMPTY_PRODUCT.nome,
    preco: typeof produtoEntrada.preco === 'number' ? produtoEntrada.preco : parseCurrencyValue(produtoEntrada.price),
    precoAntigo: typeof produtoEntrada.precoAntigo === 'number' ? produtoEntrada.precoAntigo : parseCurrencyValue(produtoEntrada.precoAntigo ?? produtoEntrada.oldPrice),
    imagens: normalizeImages(produtoEntrada),
    imagem: produtoEntrada.imagem ?? produtoEntrada.image ?? normalizeImages(produtoEntrada)[0] ?? null,
    descricao: produtoEntrada.descricao ?? produtoEntrada.description ?? EMPTY_PRODUCT.descricao,
  } : EMPTY_PRODUCT);

  useEffect(() => {
    let active = true;

    const resolveProduct = async () => {
      if (produtoEntrada?.id && !produtoId) {
        if (active) {
          setProduto((prev) => ({
            ...prev,
            ...produtoEntrada,
            nome: produtoEntrada.nome ?? produtoEntrada.title ?? prev.nome,
            preco: typeof produtoEntrada.preco === 'number'
              ? produtoEntrada.preco
              : parseCurrencyValue(produtoEntrada.price),
            precoAntigo: typeof produtoEntrada.precoAntigo === 'number'
              ? produtoEntrada.precoAntigo
              : parseCurrencyValue(produtoEntrada.precoAntigo ?? produtoEntrada.oldPrice),
            imagens: normalizeImages(produtoEntrada),
            imagem: produtoEntrada.imagem ?? produtoEntrada.image ?? normalizeImages(produtoEntrada)[0] ?? null,
            descricao: produtoEntrada.descricao ?? produtoEntrada.description ?? prev.descricao,
          }));
        }
        return;
      }

      if (!produtoId) {
        return;
      }

      const resolved = await getProductById(produtoId);
      if (!active || !resolved) {
        return;
      }

      setProduto({
        ...EMPTY_PRODUCT,
        ...resolved,
        nome: resolved.nome ?? resolved.title ?? EMPTY_PRODUCT.nome,
        preco: typeof resolved.preco === 'number' ? resolved.preco : parseCurrencyValue(resolved.price),
        precoAntigo: typeof resolved.precoAntigo === 'number' ? resolved.precoAntigo : parseCurrencyValue(resolved.precoAntigo ?? resolved.oldPrice),
        imagens: normalizeImages(resolved),
        imagem: resolved.imagem ?? resolved.image ?? normalizeImages(resolved)[0] ?? null,
        descricao: resolved.descricao ?? resolved.description ?? EMPTY_PRODUCT.descricao,
      });
    };

    resolveProduct();

    return () => {
      active = false;
    };
  }, [getProductById, produtoEntrada, produtoId]);

  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
  const [indiceImagem, setIndiceImagem] = useState(0);
  const scrollViewRef = useRef(null);
  const tamanhos = ['P', 'M', 'G', 'GG'];

  const imagens = normalizeImages(produto);
  const mostrarTamanhos = isCamisasFC(produto.categoria ?? produto.category ?? produto.cat);

  const slideWidth = width - 40;

  useEffect(() => {
    setTamanhoSelecionado(null);
    setIndiceImagem(0);
  }, [produto.id, mostrarTamanhos]);

  useEffect(() => {
    console.log('[DetalhesProdutosScreens] produto render', {
      id: produto.id,
      image: produto.image ?? null,
      imagem: produto.imagem ?? null,
      images: produto.images ?? null,
      imagens,
      mappedSources: imagens.map((item) => resolveImageSource(item)),
    });
  }, [imagens, produto.id, produto.image, produto.imagem, produto.images]);

  const scrollToImage = (index) => {
    if (scrollViewRef.current && imagens.length > 0) {
      const offset = index * slideWidth;
      setIndiceImagem(index);
      scrollViewRef.current.scrollTo({ x: offset, animated: true });
    }
  };

  const handleScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / slideWidth);
    if (newIndex !== indiceImagem && newIndex >= 0 && newIndex < imagens.length) {
      setIndiceImagem(newIndex);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Carrinho')}
          style={styles.iconButton}
          activeOpacity={0.8}
        >
          <Ionicons name="bag-outline" size={20} color="#333" />
          <CartBadge count={totalItems} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageCard}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
            onMomentumScrollEnd={handleScrollEnd}
            decelerationRate="fast"
          >
            {imagens.map((img, idx) => (
              <View key={idx} style={[styles.imageSlide, { width: slideWidth }]}>
                <Image
                  source={resolveImageSource(img)}
                  style={styles.productImage}
                  resizeMode="contain"
                  onLoad={() => {
                    console.log('[DetalhesProdutosScreens] image loaded', {
                      index: idx,
                      source: resolveImageSource(img),
                    });
                  }}
                  onError={(event) => {
                    console.log('[DetalhesProdutosScreens] image error', {
                      index: idx,
                      source: resolveImageSource(img),
                      error: event?.nativeEvent,
                    });
                  }}
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.pagination}>
            {imagens.map((_, i) => (
              <View key={i} style={[styles.dot, i === indiceImagem && styles.dotActive]} />
            ))}
          </View>
        </View>

        {imagens.length > 1 && (
          <View style={styles.thumbnailRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailContent}
            >
              {imagens.map((img, idx) => {
                const thumbSource = resolveImageSource(img);
                const isActive = idx === indiceImagem;

                return (
                  <TouchableOpacity
                    key={`${idx}-${img}`}
                    style={[styles.thumbnailButton, isActive && styles.thumbnailButtonActive]}
                    activeOpacity={0.85}
                    onPress={() => {
                      setIndiceImagem(idx);
                      scrollToImage(idx);
                    }}
                  >
                    {thumbSource ? (
                      <Image
                        source={thumbSource}
                        style={styles.thumbnailImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.thumbnailPlaceholder}>
                        <Ionicons name="image-outline" size={14} color="#999" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={styles.infoSection}>
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>{produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
            {produto.precoAntigo ? <Text style={styles.oldPrice}>{produto.precoAntigo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text> : null}
            {produto.desconto ? (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{produto.desconto}</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.productName}>{produto.nome}</Text>

          {mostrarTamanhos && (
            <View style={styles.sizeGrid}>
              <Text style={styles.sizeLabelTitle}>Tamanho</Text>
              {tamanhos.map((tam) => (
                <TouchableOpacity
                  key={tam}
                  onPress={() => setTamanhoSelecionado(tam)}
                  style={[
                    styles.sizeBox,
                    tamanhoSelecionado === tam && styles.sizeBoxActive
                  ]}
                >
                  <Text style={[
                    styles.sizeLabel,
                    tamanhoSelecionado === tam && styles.sizeLabelActive
                  ]}>{tam}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionHeader}>Descrição</Text>
            <View style={styles.descLine} />
            <Text style={styles.descriptionText}>{produto.descricao}</Text>
          </View>

          <TouchableOpacity
            style={styles.cartButton}
            activeOpacity={0.8}
            onPress={() => {
              if (mostrarTamanhos && !tamanhoSelecionado) {
                Alert.alert('Selecione um tamanho', 'Escolha um tamanho para continuar.');
                return;
              }

              const itemToAdd = {
                id: produto.id ?? produto.nome,
                nome: produto.nome,
                imagem: produto.imagem ?? produto.image ?? null,
                preco: produto.preco,
                quantity: 1,
                ...(mostrarTamanhos ? { tamanho: tamanhoSelecionado } : {}),
              };
              addItem(itemToAdd);
              Alert.alert('Sucesso', 'Produto adicionado ao carrinho!');
            }}
          >
            <View style={styles.cartButtonContent}>
              <Ionicons name="bag-outline" size={22} color="#FFF" />
              <Text style={styles.cartButtonText}>Adicionar ao Carrinho</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
