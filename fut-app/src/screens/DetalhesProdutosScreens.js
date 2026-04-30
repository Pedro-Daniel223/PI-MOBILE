import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,
  StatusBar, Dimensions, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../contexts/CartContext';
import CartBadge from '../components/CartBadge';

const { width } = Dimensions.get('window');

export default function DetalhesProdutosScreens({ route, navigation }) {
  const { addToCart, getCartCount } = useCart();

  const { produto } = route.params || {
    produto: {
      nome: 'Camisa Drakos 25/26 PUMA',
      preco: 115.00,
      precoAntigo: 285.00,
      desconto: '45% off',
      // Substitua pelo caminho real da sua imagem
      imagem: require('../assets/img/img_home/milan_r2006(2).png'),
      descricao: 'criada para quem busca estilo sem esforço e conforto o dia inteiro. Confeccionada em algodão premium 100% penteado, ela oferece um toque macio e respirável, ideal tanto para dias quentes quanto para composições em camadas. Seu design minimalista ganha destaque com um corte oversized moderno, caimento solto e ombros levemente deslocados, trazendo uma pegada urbana e atual. A gola reforçada garante durabilidade, enquanto a costura dupla nas mangas e barra proporciona resistência ao uso contínuo.'
    }
  };

  // Os tamanhos da imagem são P, M, G, GG (padrão)
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('M');
  const tamanhos = ['P', 'M', 'G', 'GG'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header - Mais limpo como na imagem */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back-outline" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Produto</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Carrinho')}>
          <Ionicons name="cart-outline" size={26} color="#d90429" />
          <CartBadge count={getCartCount()} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Container da Imagem com fundo cinza suave */}
        <View style={styles.imageCard}>
          <Image source={produto.imagem} style={styles.productImage} resizeMode="contain" />
          <View style={styles.pagination}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        <View style={styles.infoSection}>
          {/* Preços e Desconto */}
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>{produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
            <Text style={styles.oldPrice}>{produto.precoAntigo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{produto.desconto}</Text>
            </View>
          </View>

          <Text style={styles.productName}>{produto.nome}</Text>

          {/* Seção da Marca */}
          <View style={styles.brandRow}>
            <View style={styles.brandLogoCircle}>
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Puma-Logo.png/1200px-Puma-Logo.png' }} 
                style={styles.brandLogo} 
              />
            </View>
            <Text style={styles.brandNameText}>Puma</Text>
          </View>

          {/* Grade de Tamanhos - Ajustada para o estilo da imagem */}
          <View style={styles.sizeGrid}>
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

          {/* Descrição */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionHeader}>Descrição</Text>
            <View style={styles.descLine} />
            <Text style={styles.descriptionText}>{produto.descricao}</Text>
          </View>

          {/* Botão para adicionar ao Carrinho */}
          <TouchableOpacity
            style={styles.cartButton}
            activeOpacity={0.8}
            onPress={() => {
              addToCart({ ...produto, id: produto.nome, tamanho: tamanhoSelecionado });
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 60,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
  },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  imageCard: {
    backgroundColor: '#EFEFEF',
    margin: 20,
    height: 280,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '75%',
    height: '75%',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 15,
  },
  dot: {
    width: 30,
    height: 5,
    backgroundColor: '#333',
    marginHorizontal: 4,
    borderRadius: 3,
    opacity: 0.8,
  },
  dotActive: {
    backgroundColor: '#A52A2A', // Tom de vermelho escuro da barra
  },
  infoSection: {
    paddingHorizontal: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  oldPrice: {
    fontSize: 16,
    color: '#BBB',
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  discountBadge: {
    backgroundColor: '#FFF1F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginLeft: 'auto',
  },
  discountText: {
    color: '#D00',
    fontWeight: 'bold',
    fontSize: 12,
  },
  productName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  brandLogoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    marginRight: 15,
  },
  brandLogo: {
    width: 35,
    height: 25,
    resizeMode: 'contain',
  },
  brandNameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#BBB',
  },
  sizeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  sizeBox: {
    width: width * 0.2,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  sizeBoxActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  sizeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  sizeLabelActive: {
    color: '#FFF',
  },
  descriptionContainer: {
    marginTop: 10,
  },
  descriptionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  descLine: {
    width: 100,
    height: 2,
    backgroundColor: '#EEE',
    marginVertical: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 20,
    textAlign: 'left',
  },
  cartButton: {
    backgroundColor: '#000',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 35,
    alignSelf: 'center',
    marginTop: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  cartButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
});