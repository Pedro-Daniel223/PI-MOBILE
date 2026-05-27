import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';


// Importação da sua Navbar
import NavbarGlass from '../components/NavbarGlass'; 

const { width } = Dimensions.get('window');

const THEME = {
  background: '#121212',
  card: 'rgba(255, 255, 255, 0.08)',
  accent: '#ff2b2b',
  text: '#FFFFFF',
  secondary: '#888',
  border: 'rgba(255, 255, 255, 0.15)'
};

// ==================== DADOS DOS PRODUTOS ====================
// Array de objetos com informações completas dos produtos
// Inclui: id, nome, preço, desconto, categoria, imagens e descrição
// =============================================================

// Dados de exemplo com informações completas para a tela de detalhes
const PRODUTOS_EXEMPLO = [
  { 
    id: '1', 
    nome: 'Cachecol Drakos - Premium', 
    preco: 89.99, 
    precoAntigo: 149.00,
    desconto: '40% off',
    categoria: 'Acessório', 
    imagens: [
      require('../assets/img/Produtos/acessorios/objeto 1/cachecol_drakos (1).jpg'),
      require('../assets/img/Produtos/acessorios/objeto 1/cachecol_transparent (3).png'),
      require('../assets/img/Produtos/acessorios/objeto 1/cachecol_drakos (2).webp'),
    ],
     imagem: require('../assets/img/Produtos/acessorios/objeto 1/cachecol_transparent (3).png'),
    descricao: 'Cachecol oficial Drakos em material premium, 100% algodão. Design exclusivo com as cores do clube, acabamento reforçado e tamanho generoso. Perfeito para os dias mais frios, oferece conforto e estilo. Lavável à máquina sem perder a qualidade.'
  },
  { 
    id: '2', 
    nome: 'Boneco Drakos - Edição Especial', 
    preco: 129.99,
    precoAntigo: 220.00,
    desconto: '41% off',
    categoria: 'Acessório', 
    imagens: [
      require('../assets/img/Produtos/acessorios/objeto 2/boneco_drakos (1).jpg'),
      require('../assets/img/Produtos/acessorios/objeto 2/boneco_drakos (2).jpg'),
      require('../assets/img/Produtos/acessorios/objeto 2/boneco_drakos (3).jpg'),
      require('../assets/img/Produtos/acessorios/objeto 2/boneco_transparent (3).png'),
    ],
     imagem: require('../assets/img/Produtos/acessorios/objeto 2/boneco_transparent (3).png'),
    descricao: 'Boneco colecionável Drakos edição especial. Material de alta qualidade, detalhes pintados manualmente, uniforme oficial da temporada. Altura aproximada de 30cm. Acompanha base decorativa. Item perfeito para colecionadores e torcedores.'
  },
  { 
    id: '3', 
    nome: 'Touca Drakos - Inverno', 
    preco: 59.99,
    precoAntigo: 89.00,
    desconto: '33% off',
    categoria: 'Acessório', 
    imagens: [
      require('../assets/img/Produtos/acessorios/objeto 3/touca_Drakos (1).jpg'),
      require('../assets/img/Produtos/acessorios/objeto 3/touca_Drakos (2).jpg'),
      require('../assets/img/Produtos/acessorios/objeto 3/touca_transparent.png'),
      require('../assets/img/Produtos/acessorios/objeto 3/touca_Drakos (1).webp'),
    ],
     imagem: require('../assets/img/Produtos/acessorios/objeto 3/touca_transparent.png'),
    descricao: 'Touca de inverno oficial Drakos, confeccionada em lã acrílica de alta qualidade. Interior felpudo para maior conforto térmico, ajuste perfeito e bordado do escudo. Disponível na cor tradicional. Ideal para dias frios e dias de jogo.'
  },
  { 
    id: '4', 
    nome: 'Drakos Temp 24/25 - Camisa Oficial', 
    preco: 169.99, 
    precoAntigo: 285.00,
    desconto: '40% off',
    categoria: 'Camisa', 
    imagens: [
      require('../assets/img/img_home/milan_r2006(2).png'),
    ],
    imagem: require('../assets/img/img_home/milan_r2006(2).png'),
    descricao: 'Camisa oficial da temporada 24/25. Confeccionada com tecido dry-fit de alta performance, tecnologia antichamas e corte ergonômico que garante máxima liberdade de movimento. Possui gola reforçada e detalhes em vermelho que remetem à tradição do clube. Ideal para jogadores que buscam estilo e conforto dentro e fora de campo.'
  },
  { 
    id: '5', 
    nome: 'Drakos Temp 24/25 - Edição Limitada', 
    preco: 189.99,
    precoAntigo: 320.00,
    desconto: '41% off',
    categoria: 'Camisa', 
    imagens: [
      require('../assets/img/img_home/milan_r2006(2).png'),
    ],
    imagem: require('../assets/img/img_home/milan_r2006(2).png'),
    descricao: 'Versão limitada da camisa Drakos 24/25, comemorativa aos 20 anos do clube. Possui acabamento premium, escudo bordado e numeração especial. Tecido respirável com proteção UV e costuras planas para evitar atrito. Disponível apenas nesta temporada.'
  },
  { 
    id: '6', 
    nome: 'Drakos Temp 24/25 - Torcedor', 
    preco: 149.99,
    precoAntigo: 210.00,
    desconto: '29% off',
    categoria: 'Camisa', 
    imagens: [
      require('../assets/img/img_home/milan_r2006(2).png'),
    ],
    imagem: require('../assets/img/img_home/milan_r2006(2).png'),
    descricao: 'Versão torcedor da camisa Drakos 24/25. Confortável e durável, ideal para uso casual e dias de jogo. Feita em algodão e poliéster, proporciona equilíbrio entre respirabilidade e resistência. Design elegante com escudo aplicado em silk.'
  },
];

function LojaContent({ navigation }) {
  const [search, setSearch] = useState('');
  const insets = useSafeAreaInsets();

  const renderProduto = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.imagem} style={styles.cardImage} resizeMode="cover" />
      <Text style={styles.cardCategoria}>{item.categoria}</Text>
      <Text style={styles.cardNome}>{item.nome}</Text>
      <Text style={styles.cardPreco}>{item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
       <TouchableOpacity
         style={styles.verMaisBtn}
         onPress={() => navigation.navigate('DetalhesProdutos', { produto: item })}
       >
         <Text style={styles.verMaisText}>Ver Mais</Text>
       </TouchableOpacity>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.headerContent}>
      <Text style={styles.promoTitle}>
        NOVAS{"\n"}CAMISAS{"\n"}
        <Text style={styles.promoRed}>PREMIUM</Text>
      </Text>
      <Text style={styles.promoSub}>Olhe para o seu bolso antes de tudo, você pode economizar!</Text>
      <View style={styles.highlightBanner}>
        <LinearGradient colors={['rgba(255,255,255,0.1)', 'transparent']} style={StyleSheet.absoluteFill} />
        <View style={styles.paginationDotContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top || 20 }]}> 
      <StatusBar barStyle="light-content" />
      <View style={styles.topBar}>
        <View style={styles.avatar} />
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Buscar produtos"
            placeholderTextColor="#888"
            style={styles.searchTextInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={PRODUTOS_EXEMPLO}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

    </View>
  );
}

// ==================== WRAPPER COM SAFEAREAPROVIDER ====================
// Componente wrapper que envolve LojaContent com SafeAreaProvider
export default function LojaScreens(props) {
  return (
    <SafeAreaProvider>
      <LojaContent {...props} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // ==================== CONTAINER PRINCIPAL ====================
  container: {
    flex: 1,
    backgroundColor: '#101010'
  },

  // ==================== BARRA SUPERIOR ====================
  // Contém avatar e campo de busca
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between'
  },

  // ==================== BARRA SUPERIOR - AVATAR ====================
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#fff'
  },

  // ==================== BARRA SUPERIOR - CAMPO DE BUSCA ====================
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#333'
  },
  // BARRA SUPERIOR - CAMPO DE BUSCA - INPUT
  searchTextInput: { 
    flex: 1, 
    color: '#fff', 
    fontSize: 13 
  },
  // HEADER
  headerContent: { 
    paddingHorizontal: 20, 
    marginTop: 20 
  },
  // HEADER - PROMOÇÃO
  promoTitle: { 
    color: '#fff', 
    fontSize: 40, 
    fontWeight: '900', 
    lineHeight: 42,
    letterSpacing: 1,
  },
  // HEADER - PROMOÇÃO - "PREMIUM" EM VERMELHO
  promoRed: { color: '#880000' },
  promoSub: { 
    color: '#666', 
    fontSize: 12, 
    marginTop: 8, 
    marginBottom: 20 
  },
  // BANNER DE DESTAQUE
  highlightBanner: {
    height: 160,
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 15
  },
  // BANNER DE DESTAQUE - PONTOS DE PAGINAÇÃO
  paginationDotContainer: { 
    flexDirection: 'row', 
    gap: 8 
  },
  // BANNER DE DESTAQUE - PONTOS DE PAGINAÇÃO - ESTILO PADRÃO
  dot: { 
    width: 18, 
    height: 3, 
    backgroundColor: '#fff', 
    borderRadius: 2, 
    opacity: 0.3 
  },
  // BANNER DE DESTAQUE - PONTOS DE PAGINAÇÃO - ESTILO ATIVO
  activeDot: { 
    backgroundColor: '#880000', 
    opacity: 1 
  },
  // SEÇÃO DE PRODUTOS EM DESTAQUE
  sectionHeader: { 
    marginTop: 35, 
    marginBottom: 15 
  },
  // SEÇÃO DE PRODUTOS EM DESTAQUE - SUBTÍTULO
  sectionSubtitle: { 
    color: '#666', 
    fontSize: 12, 
    fontWeight: '600' 
  },
  // SEÇÃO DE PRODUTOS EM DESTAQUE - TÍTULO
  sectionTitle: { 
    color: '#fff', 
    fontSize: 32, 
    fontWeight: '900' 
  },
  // LISTA DE PRODUTOS
  listContent: { paddingBottom: 120 }, 
   row: {
     justifyContent: 'space-between',
     paddingHorizontal: 15,
     gap: 15,
   },
  // CARD DE PRODUTO
  card: {
    backgroundColor: THEME.card,
    width: (width - 45) / 2,
    marginBottom: 20,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 300,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  cardImage: {
    width: '100%',
    height: 130,
    marginBottom: 10,
  },
  cardCategoria: {
    color: '#666',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardNome: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    lineHeight: 18,
  },
  cardPreco: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 8,
  },
  verMaisBtn: {
    backgroundColor: THEME.accent,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginTop: 8,
    width: '90%',
  },
  verMaisText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  // CARD DE PRODUTO - CONTEÚDO (IMAGEM + INFORMAÇÕES)
  cardContent: {
    flex: 0
  },
// CARD DE PRODUTO - INFORMAÇÕES (CATEGORIA, NOME, PREÇO)
  cardImage: { 
    width: '100%', 
    height: 120, 
    marginBottom: 8 
  },
  // CARD DE PRODUTO - INFORMAÇÕES (CATEGORIA, NOME, PREÇO) - CATEGORIA
  cardCategoria: { 
    color: '#666', 
    fontSize: 10, 
    fontWeight: '600' 
  },
  // CARD DE PRODUTO - INFORMAÇÕES (CATEGORIA, NOME, PREÇO) - NOME
  cardNome: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  // CARD DE PRODUTO - INFORMAÇÕES (CATEGORIA, NOME, PREÇO) - PREÇO
  cardPreco: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 4
  },
  // CARD DE PRODUTO - BOTÃO "VER MAIS"
  verMaisBtn: {
    backgroundColor: THEME.accent,
    paddingVertical: 11,
    paddingHorizontal: 19,
    borderRadius: 26,
    alignSelf: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  // CARD DE PRODUTO - BOTÃO "VER MAIS" - TEXTO
  verMaisText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});