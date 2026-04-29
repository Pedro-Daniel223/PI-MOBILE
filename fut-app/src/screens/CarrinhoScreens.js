import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../contexts/CartContext';

export default function CarrinhoScreens({ navigation }) {
  const { cartItems, removeFromCart, updateQuantity, getCartCount } = useCart();

  const totalPrice = cartItems.reduce((total, item) => total + item.preco * item.quantity, 0);

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={item.imagem} style={styles.itemImage} resizeMode="contain" />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.nome}</Text>
        <Text style={styles.itemPrice}>R$ {item.preco.toFixed(2)}</Text>
        <Text style={styles.itemSize}>Tamanho: {item.tamanho}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
            style={styles.quantityBtn}
          >
            <Ionicons name="remove" size={16} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
            style={styles.quantityBtn}
          >
            <Ionicons name="add" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => removeFromCart(item.id)}
        style={styles.removeBtn}
      >
        <Ionicons name="trash-outline" size={20} color="#d90429" />
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back-outline" size={26} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Carrinho</Text>
          <View style={{ width: 45 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#CCC" />
          <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate('Loja')}
          >
            <Text style={styles.shopBtnText}>Ir às compras</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carrinho ({getCartCount()})</Text>
        <View style={{ width: 45 }} />
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>R$ {totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>Finalizar Compra</Text>
        </TouchableOpacity>
      </View>
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
  backBtn: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  shopBtn: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  shopBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    marginBottom: 5,
  },
  itemSize: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBtn: {
    backgroundColor: '#000',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
    color: '#000',
  },
  removeBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  footer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  checkoutBtn: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});