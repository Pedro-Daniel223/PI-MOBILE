import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../contexts/CartContext';
import NavbarGlass from '../components/NavbarGlass';

const THEME = {
  background: '#121212',
  card: 'rgba(255, 255, 255, 0.08)',
  accent: '#ff2b2b',
  text: '#FFFFFF',
  secondary: '#888',
  border: 'rgba(255, 255, 255, 0.15)'
};

function CarrinhoContent({ navigation }) {
  const insets = useSafeAreaInsets();
  const { cartItems, removeFromCart, updateQuantity, getCartCount } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.preco * item.quantity), 0);
  };

  const handleRemoveItem = (item) => {
    Alert.alert(
      'Remover Item',
      `Deseja remover "${item.nome}" do carrinho?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', onPress: () => removeFromCart(item.id) }
      ]
    );
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(item);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={item.imagem} style={styles.itemImage} resizeMode="contain" />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.nome}</Text>
        <Text style={styles.itemCategory}>{item.categoria}</Text>
        <Text style={styles.itemPrice}>R$ {item.preco.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityBtn}
          onPress={() => handleQuantityChange(item, item.quantity - 1)}
        >
          <Ionicons name="remove" size={16} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityBtn}
          onPress={() => handleQuantityChange(item, item.quantity + 1)}
        >
          <Ionicons name="add" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => handleRemoveItem(item)}
      >
        <Ionicons name="trash-outline" size={20} color="#ff2b2b" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={80} color="#666" />
      <Text style={styles.emptyTitle}>Carrinho vazio</Text>
      <Text style={styles.emptyText}>Adicione produtos da loja para continuar</Text>
      <TouchableOpacity
        style={styles.shopBtn}
        onPress={() => navigation.navigate('Loja')}
      >
        <Text style={styles.shopBtnText}>Ir para Loja</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carrinho</Text>
        <View style={styles.placeholder} />
      </View>

      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* TOTAL E CHECKOUT */}
          <View style={styles.checkoutContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>R$ {calculateTotal().toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.8}>
              <Text style={styles.checkoutText}>Finalizar Compra</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}

      <NavbarGlass navigation={navigation} />
    </View>
  );
}

export default function CarrinhoScreens(props) {
  return (
    <SafeAreaProvider>
      <CarrinhoContent {...props} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border
  },
  headerTitle: {
    color: THEME.text,
    fontSize: 20,
    fontWeight: 'bold'
  },
  placeholder: {
    width: 40
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  emptyTitle: {
    color: THEME.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10
  },
  emptyText: {
    color: THEME.secondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30
  },
  shopBtn: {
    backgroundColor: THEME.accent,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25
  },
  shopBtnText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '600'
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.border
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12
  },
  itemDetails: {
    flex: 1
  },
  itemName: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  itemCategory: {
    color: THEME.secondary,
    fontSize: 12,
    marginBottom: 4
  },
  itemPrice: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: '600'
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12
  },
  quantityBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: THEME.secondary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  quantityText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center'
  },
  removeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: THEME.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.border
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  totalLabel: {
    color: THEME.secondary,
    fontSize: 16
  },
  totalValue: {
    color: THEME.text,
    fontSize: 20,
    fontWeight: 'bold'
  },
  checkoutBtn: {
    backgroundColor: THEME.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  checkoutText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8
  }
});