import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Dimensions,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Importação da sua Navbar
import NavbarGlass from '../components/NavbarGlass'; 

const { width } = Dimensions.get('window');

const THEME = {
  background: '#121212',
  card: 'rgba(255, 255, 255, 0.08)', // Efeito vidro
  accent: '#ff2b2b',
  text: '#FFFFFF',
  secondary: '#888',
  border: 'rgba(255, 255, 255, 0.15)'
};

const PRODUTOS_EXEMPLO = [
  { id: '1', nome: 'Drakos Temp 24/25', preco: 169.99, categoria: 'Camisa', imagem: require('../assets/img/img_home/milan_r2006(2).png') },
  { id: '2', nome: 'Drakos Temp 24/25', preco: 169.99, categoria: 'Camisa', imagem: require('../assets/img/img_home/milan_r2006(2).png') },
  { id: '3', nome: 'Drakos Temp 24/25', preco: 169.99, categoria: 'Camisa', imagem: require('../assets/img/img_home/milan_r2006(2).png') },
];

export default function LojaScreens({ navigation }) {
  const [search, setSearch] = useState('');

  // Componente de Cabeçalho da Lista (Banner + Título Seção)
  const ListHeader = () => (
    <View style={styles.headerContent}>
      <Text style={styles.promoTitle}>NOVAS{"\n"}CAMISAS{"\n"}<Text style={styles.promoRed}>PREMIUM</Text></Text>
      <Text style={styles.promoSub}>Olhe para seu bolso antes</Text>

      {/* Banner de Destaque vazio (como no Figma) */}
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
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      <View style={styles.cartIconContainer}>
         <Ionicons name="cart" size={18} color="#fff" />
      </View>
      
      <Image source={item.imagem} style={styles.cardImage} resizeMode="contain" />
      
      <View style={styles.cardInfo}>
        <Text style={styles.cardCategoria}>{item.categoria}</Text>
        <Text style={styles.cardNome}>{item.nome}</Text>
        <Text style={styles.cardPreco}>{item.preco.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER SUPERIOR */}
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
          <TouchableOpacity style={styles.cartBtn}>
             <Ionicons name="cart-outline" size={20} color="#ff2b2b" />
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
      </SafeAreaView>

      <NavbarGlass navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101010' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    justifyContent: 'space-between'
  },
  avatar: { width: 45, height: 45, borderRadius: 22, borderWidth: 1, borderColor: '#fff' },
  searchBar: {
    flex: 1,
    height: 38,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#333'
  },
  searchTextInput: { flex: 1, color: '#fff', fontSize: 12 },
  cartBtn: {
    width: 38,
    height: 38,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333'
  },
  headerContent: { paddingHorizontal: 20, marginTop: 30 },
  promoTitle: { 
    color: '#fff', 
    fontSize: 42, 
    fontWeight: '900', 
    lineHeight: 45,
    letterSpacing: 2,
    fontFamily: 'serif' // Ou a fonte Serifada que você instalou
  },
  promoRed: { color: '#8b0000' },
  promoSub: { color: '#666', fontSize: 12, marginTop: 5, marginBottom: 20 },
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
  paginationDotContainer: { flexDirection: 'row', gap: 8 },
  dot: { width: 18, height: 3, backgroundColor: '#fff', borderRadius: 2, opacity: 0.3 },
  activeDot: { backgroundColor: '#ff2b2b', opacity: 1 },
  
  sectionHeader: { marginTop: 40, marginBottom: 15 },
  sectionSubtitle: { color: '#666', fontSize: 12, fontWeight: '600' },
  sectionTitle: { color: '#fff', fontSize: 32, fontWeight: '900', fontFamily: 'serif' },

  listContent: { paddingBottom: 140 },
  row: { justifyContent: 'space-between', paddingHorizontal: 15 },
  
  card: { 
    backgroundColor: THEME.card, 
    width: (width - 50) / 2, 
    marginBottom: 20, 
    borderRadius: 24, 
    padding: 15,
    borderWidth: 1, 
    borderColor: THEME.border 
  },
  cartIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  cardImage: { width: '100%', height: 130, marginBottom: 10 },
  cardCategoria: { color: '#666', fontSize: 10, fontWeight: '600' },
  cardNome: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  cardPreco: { color: '#fff', fontSize: 16, fontWeight: '900', marginTop: 5 },
});