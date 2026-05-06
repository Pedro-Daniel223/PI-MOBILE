import React, { useState, useRef } from 'react';
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
      imagens: [require('../assets/img/img_home/milan_r2006(2).png')],
      imagem: require('../assets/img/img_home/milan_r2006(2).png'),
      descricao: 'criada para quem busca estilo sem esforço e conforto o dia inteiro. Confeccionada em algodão premium 100% penteado, ela oferece um toque macio e respirável, ideal tanto para dias quentes quanto para composições em camadas. Seu design minimalista ganha destaque com um corte oversized moderno, caimento solto e ombros levemente deslocados, trazendo uma pegada urbana e atual. A gola reforçada garante durabilidade, enquanto a costura dupla nas mangas e barra proporciona resistência ao uso contínuo.'
    }
  };

  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('M');
  const [indiceImagem, setIndiceImagem] = useState(0);
  const scrollViewRef = useRef(null);
  const tamanhos = ['P', 'M', 'G', 'GG'];

  const imagens = produto.imagens || (produto.imagem ? [produto.imagem] : []);
  const mostrarTamanhos = produto.categoria && produto.categoria.toLowerCase() !== 'acessório';

  const slideWidth = width - 40; // 20 de margem de cada lado do imageCard

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
        
        {/* Container da Imagem com Scroll Horizontal */}
        <View style={styles.imageCard}>
      <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.imagesScrollContent}
            snapToAlignment="center"
          >
            {imagens.map((img, index) => (
              <View key={index} style={styles.imageSlide}>
                <Image source={img} style={styles.productImage} resizeMode="contain" />
              </View>
            ))}
          </ScrollView>

          {/* Paginação dinâmica */}
          {imagens.length > 1 && (
            <View style={styles.pagination}>
              {imagens.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === indiceImagem && styles.dotActive
                  ]}
                />
              ))}
            </View>
          )}

          {/* Botões de navegação lateral */}
          {imagens.length > 1 && (
            <>
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonLeft]}
                onPress={() => scrollToImage(Math.max(0, indiceImagem - 1))}
              >
                <Ionicons name="chevron-back" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonRight]}
                onPress={() => scrollToImage(Math.min(imagens.length - 1, indiceImagem + 1))}
              >
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
            </>
          )}
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
              if (mostrarTamanhos) {
                addToCart({ 
                  ...produto, 
                  id: produto.nome, 
                  tamanho: tamanhoSelecionado,
                  imagens: produto.imagens || [produto.imagem]
                });
              } else {
                addToCart({ 
                  ...produto, 
                  id: produto.nome,
                  imagens: produto.imagens || [produto.imagem]
                });
              }
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
     overflow: 'hidden',
   },
   imagesScrollContent: {
     // Não precisa de flexGrow, o paging cuida da largura
   },
   imageSlide: {
     width: width - 40, // Largura da tela menos as margens do imageCard (20+20)
     height: 280,
     justifyContent: 'center',
     alignItems: 'center',
   },
   productImage: {
     width: '85%',
     height: '85%',
   },
   pagination: {
     flexDirection: 'row',
     position: 'absolute',
     bottom: 15,
     gap: 6,
   },
   dot: {
     width: 8,
     height: 8,
     borderRadius: 4,
     backgroundColor: '#999',
   },
   dotActive: {
     backgroundColor: '#A52A2A',
     width: 20,
   },
   navButton: {
     position: 'absolute',
     top: '45%',
     transform: [{ translateY: -30 }],
     width: 36,
     height: 36,
     borderRadius: 18,
     backgroundColor: 'rgba(255, 255, 255, 0.9)',
     justifyContent: 'center',
     alignItems: 'center',
     elevation: 4,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.15,
     shadowRadius: 4,
   },
   navButtonLeft: {
     left: 8,
   },
   navButtonRight: {
     right: 8,
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
   sizeGrid: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     justifyContent: 'space-between',
     marginBottom: 30,
     gap: 12,
   },
   sizeLabelTitle: {
     fontSize: 16,
     fontWeight: '700',
     color: '#333',
     marginBottom: 10,
     width: '100%',
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