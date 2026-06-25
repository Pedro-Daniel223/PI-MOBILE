import React, { useState, useRef } from 'react';
import {
  View, Text, Image, TouchableOpacity, ScrollView,
  StatusBar, Dimensions, Alert, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import CartBadge from '../components/CartBadge';
import { DEFAULT_PRODUTO } from '../data/dataDetalhesProdutos';
import styles from '../styles/styleDetalhesProdutos/styleDetalhesProdutos';

const { width } = Dimensions.get('window');

export default function DetalhesProdutosScreens({ route, navigation }) {
  const { addToCart, getCartCount } = useCart();

  const produto = (route.params && route.params.produto) ? route.params.produto : DEFAULT_PRODUTO;

  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('M');
  const [indiceImagem, setIndiceImagem] = useState(0);
  const scrollViewRef = useRef(null);
  const tamanhos = ['P', 'M', 'G', 'GG'];

  const imagens = produto.imagens || (produto.imagem ? [produto.imagem] : []);
  const mostrarTamanhos = produto.categoria && produto.categoria.toLowerCase() !== 'acessório';

  const slideWidth = width - 40;

  const scrollToImage = (index) => {
    if (scrollViewRef.current && imagens.length > 0) {
      const offset = index * slideWidth;
      scrollViewRef.current.scrollTo({ x: offset, animated: true });
    }
  };

  const handleScroll = (event) => {
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
        <CartBadge count={getCartCount()} onPress={() => navigation.navigate('Carrinhos')} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageCard}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {imagens.map((img, idx) => (
              <View key={idx} style={[styles.imageSlide, { width: slideWidth }]}>
                <Image source={img} style={styles.productImage} resizeMode="contain" />
              </View>
            ))}
          </ScrollView>

          <View style={styles.pagination}>
            {imagens.map((_, i) => (
              <View key={i} style={[styles.dot, i === indiceImagem && styles.dotActive]} />
            ))}
          </View>
        </View>

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
              const itemToAdd = {
                ...produto,
                id: produto.nome,
                imagens: produto.imagens || (produto.imagem ? [produto.imagem] : []),
                ...(mostrarTamanhos ? { tamanho: tamanhoSelecionado } : {}),
              };
              addToCart(itemToAdd);
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
