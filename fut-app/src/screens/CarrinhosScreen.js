import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../contexts/CartContext';

const theme = {
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  accent: '#880000',
  accentLight: '#FFF0F0',
  dangerIcon: '#880000',
  black: '#000000',
  border: '#E5E5EA',
};

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const itemOpacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleRemoveAnimation = () => {
    Animated.timing(itemOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onRemove(item.id, item.tamanho);
      itemOpacity.setValue(1);
    });
  };

  const handleIncrement = () => onUpdateQuantity(item.id, item.tamanho, item.quantity + 1);
  const handleDecrement = () => {
    if (item.quantity > 1) onUpdateQuantity(item.id, item.tamanho, item.quantity - 1);
  };

  // 🔁 Função robusta para obter a imagem de diferentes campos
  const getImageSource = () => {
    // 1. Array de imagens (comum em produtos)
    if (Array.isArray(item.imagens) && item.imagens.length > 0) {
      return item.imagens[0];
    }
    // 2. String única em vários campos possíveis
    if (item.imagem) return item.imagem;
    if (item.image) return item.image;
    if (item.imageUrl) return item.imageUrl;
    if (item.url) return item.url;
    // 3. Se o item tiver um objeto produto pai (ex: item.produto.imagem)
    if (item.produto) {
      if (Array.isArray(item.produto.imagens) && item.produto.imagens.length > 0)
        return item.produto.imagens[0];
      if (item.produto.imagem) return item.produto.imagem;
      if (item.produto.image) return item.produto.image;
    }
    return null;
  };

  const imageSource = getImageSource();

  return (
    <Animated.View
      style={[styles.cartItemContainer, { transform: [{ scale: scaleAnim }], opacity: itemOpacity }]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.cartItem}>
          <View style={styles.imageWrapper}>
            {imageSource ? (
              <Image source={imageSource} style={styles.productImage} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="shirt-outline" size={28} color="#D1D1D6" />
              </View>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.sectionLabel}>Descrição do pedido</Text>
            <Text style={styles.productName} numberOfLines={2}>
              {item.nome || 'Produto sem nome'}
            </Text>

            <View style={styles.detailsRow}>
              <Text style={styles.detailText}>
                Tamanho: <Text style={styles.detailValue}>{item.tamanho || '#'}</Text>
              </Text>
              <Text style={styles.detailText}>
                Qtd: <Text style={styles.detailValue}>{item.quantity.toString().padStart(2, '0')}</Text>
              </Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Preço unitário</Text>
              <Text style={styles.priceValue}>
                {item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Text>
            </View>

            <View style={styles.actionsRow}>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={handleDecrement}
                  style={[styles.qtyBtn, item.quantity <= 1 && styles.qtyBtnDisabled]}
                  disabled={item.quantity <= 1}
                >
                  <Text style={[styles.qtySymbol, item.quantity <= 1 && { color: '#D1D1D6' }]}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyNumber}>{item.quantity.toString().padStart(2, '0')}</Text>
                <TouchableOpacity onPress={handleIncrement} style={styles.qtyBtn}>
                  <Text style={styles.qtySymbol}>+</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.deleteButton} onPress={handleRemoveAnimation}>
                <Ionicons name="trash-outline" size={18} color={theme.accent} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function CarrinhosScreen({ navigation }) {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const total = getCartTotal();
  const hasItems = cartItems.length > 0;

  const handleCheckout = () => {
    Alert.alert(
      'Finalizar compra',
      'Deseja realmente enviar seu pedido para o Drakos FC?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            clearCart();
            Alert.alert('Sucesso!', 'Pedido enviado com sucesso.');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MEU CARRINHO</Text>
        <TouchableOpacity onPress={() => hasItems && clearCart()}>
          <Text style={[styles.clearText, !hasItems && { opacity: 0 }]}>Limpar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={hasItems ? styles.scrollContent : styles.emptyScrollContent}
      >
        {hasItems ? (
          cartItems.map((item) => (
            <CartItem
              key={`${item.id}-${item.tamanho}`}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="bag-handle-outline" size={60} color={theme.accent} />
            </View>
            <Text style={styles.emptyTitle}>Sacola vazia</Text>
            <Text style={styles.emptySubtitle}>Parece que você ainda não escolheu seu manto.</Text>
            <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Loja')}>
              <Text style={styles.shopButtonText}>Explorar Loja</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {hasItems && (
        <View style={styles.bottomBarContainer}>
          <View style={styles.bottomBar}>
            <View>
              <Text style={styles.totalLabel}>Total geral</Text>
              <Text style={styles.totalAmount}>
                {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Text>
            </View>

            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout} activeOpacity={0.9}>
              <Text style={styles.checkoutText}>Comprar</Text>
              <View style={styles.checkoutIcon}>
                <Ionicons name="arrow-forward" size={18} color={theme.black} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 16, fontWeight: '800', color: theme.black, letterSpacing: 1 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  clearText: { color: theme.accent, fontWeight: '600', fontSize: 14 },

  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 150 },
  emptyScrollContent: { flexGrow: 1, justifyContent: 'center' },

  cartItemContainer: { marginBottom: 15 },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    borderRadius: 24,
    padding: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  imageWrapper: { width: 90, height: 110, borderRadius: 18, backgroundColor: '#F2F2F7', overflow: 'hidden' },
  productImage: { width: '100%', height: '100%' },
  imagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  infoContainer: { flex: 1, marginLeft: 15, justifyContent: 'space-between', paddingVertical: 2 },
  sectionLabel: { fontSize: 10, fontWeight: '700', color: theme.accent, textTransform: 'uppercase', marginBottom: 4 },
  productName: { fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 8, lineHeight: 20 },

  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailText: { fontSize: 12, color: theme.textSecondary, fontWeight: '500' },
  detailValue: { fontWeight: '700', color: theme.black },

  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  priceLabel: { fontSize: 12, color: theme.textSecondary, fontWeight: '500' },
  priceValue: { fontSize: 15, fontWeight: '700', color: theme.black },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 4,
  },
  qtyBtn: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8 },
  qtyBtnDisabled: { opacity: 0.5 },
  qtySymbol: { fontSize: 18, fontWeight: '600' },
  qtyNumber: { fontSize: 14, fontWeight: '800', marginHorizontal: 12, minWidth: 28, textAlign: 'center' },
  deleteButton: { width: 38, height: 38, borderRadius: 12, backgroundColor: theme.accentLight, justifyContent: 'center', alignItems: 'center' },

  bottomBarContainer: { position: 'absolute', bottom: 30, left: 20, right: 20 },
  bottomBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    padding: 15,
    paddingLeft: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  totalLabel: { fontSize: 12, color: theme.textSecondary, fontWeight: '600' },
  totalAmount: { fontSize: 24, fontWeight: '900', color: theme.black, letterSpacing: -0.5 },

  checkoutButton: {
    backgroundColor: theme.black,
    flexDirection: 'row',
    height: 54,
    paddingLeft: 20,
    paddingRight: 6,
    borderRadius: 22,
    alignItems: 'center',
  },
  checkoutText: { color: '#FFF', fontWeight: '700', fontSize: 15, marginRight: 12 },
  checkoutIcon: { width: 42, height: 42, backgroundColor: '#FFF', borderRadius: 18, justifyContent: 'center', alignItems: 'center' },

  emptyState: { alignItems: 'center', paddingHorizontal: 40 },
  emptyIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.accentLight, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: theme.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: theme.textSecondary, textAlign: 'center', marginBottom: 30 },
  shopButton: { backgroundColor: theme.black, paddingVertical: 14, paddingHorizontal: 30, borderRadius: 18 },
  shopButtonText: { color: '#FFF', fontWeight: '700' },
});