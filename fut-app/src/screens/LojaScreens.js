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

// Dados de exemplo com informações completas para a tela de detalhes
const PRODUTOS_EXEMPLO = [
  { 
    id: '1', 
    nome: 'Drakos Temp 24/25', 
    preco: 169.99, 
    precoAntigo: 285.00,
    desconto: '40% off',
    categoria: 'Camisa', 
    imagem: require('../assets/img/img_home/milan_r2006(2).png'),
    descricao: 'Camisa oficial da temporada 24/25. Confeccionada com tecido dry-fit de alta performance, tecnologia antichamas e corte ergonômico que garante máxima liberdade de movimento. Possui gola reforçada e detalhes em vermelho que remetem à tradição do clube. Ideal para jogadores que buscam estilo e conforto dentro e fora de campo.'
  },
  { 
    id: '2', 
    nome: 'Drakos Temp 24/25 - Edição Limitada', 
    preco: 189.99,
    precoAntigo: 320.00,
    desconto: '41% off',
    categoria: 'Camisa', 
    imagem: require('../assets/img/img_home/milan_r2006(2).png'),
    descricao: 'Versão limitada da camisa Drakos 24/25, comemorativa aos 20 anos do clube. Possui acabamento premium, escudo bordado e numeração especial. Tecido respirável com proteção UV e costuras planas para evitar atrito. Disponível apenas nesta temporada.'
  },
  { 
    id: '3', 
    nome: 'Drakos Temp 24/25 - Torcedor', 
    preco: 149.99,
    precoAntigo: 210.00,
    desconto: '29% off',
    categoria: 'Camisa', 
    imagem: require('../assets/img/img_home/milan_r2006(2).png'),
    descricao: 'Versão torcedor da camisa Drakos 24/25. Confortável e durável, ideal para uso casual e dias de jogo. Feita em algodão e poliéster, proporciona equilíbrio entre respirabilidade e resistência. Design elegante com escudo aplicado em silk.'
  },
];

function LojaContent({ navigation }) {
  const [search, setSearch] = useState('');
  const insets = useSafeAreaInsets();

  const ListHeader = () => (
    <View style={styles.headerContent}>
      <Text style={styles.promoTitle}>
        NOVAS{"\n"}CAMISAS{"\n"}
        <Text style={styles.promoRed}>PREMIUM</Text>
      </Text>
      <Text style={styles.promoSub}>Olhe para seu bolso antes</Text>

      <View style={styles.highlightBanner}>
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.paginationDotContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionSubtitle}>Em destaque</Text>
        <Text style={styles.sectionTitle}>Produtos</Text>
      </View>
    </View>
  );

  const renderProduto = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Image source={item.imagem} style={styles.cardImage} resizeMode="contain" />
        <View style={styles.cardInfo}>
          <Text style={styles.cardCategoria}>{item.categoria}</Text>
          <Text style={styles.cardNome} numberOfLines={2}>{item.nome}</Text>
          <Text style={styles.cardPreco}>R$ {item.preco.toFixed(2)}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.verMaisBtn}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('DetalhesProdutosScreens', { produto: item })}
      >
        <Text style={styles.verMaisText}>Ver Mais</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* BARRA SUPERIOR */}
      <View style={styles.topBar}>
        <Image source={{uri: 'https://i.pravatar.cc/100'}} style={styles.avatar} />
        <View style={styles.searchBar}>
           <TextInput 
              placeholder="pesquisar produtos" 
              placeholderTextColor="#555" 
              style={styles.searchTextInput}
              value={search}
              onChangeText={setSearch}
           />
           <Ionicons name="search" size={16} color="#888" />
        </View>

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

      <NavbarGlass navigation={navigation} />
    </View>
  );
}

export default function LojaScreens(props) {
  return (
    <SafeAreaProvider>
      <LojaContent {...props} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#101010' 
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between'
  },
  avatar: { 
    width: 45, 
    height: 45, 
    borderRadius: 22, 
    borderWidth: 1, 
    borderColor: '#fff' 
  },
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
  searchTextInput: { 
    flex: 1, 
    color: '#fff', 
    fontSize: 13 
  },

  headerContent: { 
    paddingHorizontal: 20, 
    marginTop: 20 
  },
  promoTitle: { 
    color: '#fff', 
    fontSize: 40, 
    fontWeight: '900', 
    lineHeight: 42,
    letterSpacing: 1,
  },
  promoRed: { color: '#880000' },
  promoSub: { 
    color: '#666', 
    fontSize: 12, 
    marginTop: 8, 
    marginBottom: 20 
  },
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
  paginationDotContainer: { 
    flexDirection: 'row', 
    gap: 8 
  },
  dot: { 
    width: 18, 
    height: 3, 
    backgroundColor: '#fff', 
    borderRadius: 2, 
    opacity: 0.3 
  },
  activeDot: { 
    backgroundColor: '#880000', 
    opacity: 1 
  },
  sectionHeader: { 
    marginTop: 35, 
    marginBottom: 15 
  },
  sectionSubtitle: { 
    color: '#666', 
    fontSize: 12, 
    fontWeight: '600' 
  },
  sectionTitle: { 
    color: '#fff', 
    fontSize: 32, 
    fontWeight: '900' 
  },
  listContent: { paddingBottom: 120 }, 
  row: { 
    justifyContent: 'space-between', 
    paddingHorizontal: 15 
  },
  card: {
    backgroundColor: THEME.card,
    width: (width - 45) / 2,
    marginBottom: 15,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    height: 280
  },
  cardContent: {
    flex: 0
  },

  cardImage: { 
    width: '100%', 
    height: 120, 
    marginBottom: 8 
  },
  cardCategoria: { 
    color: '#666', 
    fontSize: 10, 
    fontWeight: '600' 
  },
  cardNome: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  cardPreco: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 4
  },
  verMaisBtn: {
    backgroundColor: THEME.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  verMaisText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});