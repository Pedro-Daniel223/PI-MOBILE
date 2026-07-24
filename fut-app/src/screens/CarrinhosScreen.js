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
import { useSubscription } from '../contexts/SubscriptionContext';
import { theme } from '../data/dataCarrinhos';
import styles from '../styles/styleCarrinhos/styleCarrinhos';

// theme moved to src/data/dataCarrinhos.js

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

  const getImageSource = () => {
    if (Array.isArray(item.imagens) && item.imagens.length > 0) {
      return item.imagens[0];
    }
    if (item.imagem) return item.imagem;
    if (item.image) return item.image;
    if (item.imageUrl) return item.imageUrl;
    if (item.url) return item.url;
    if (item.produto) {
      if (Array.isArray(item.produto.imagens) && item.produto.imagens.length > 0) {
        return item.produto.imagens[0];
      }
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
  const { cartItems, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const { addToPurchaseHistory } = useSubscription();
  const total = subtotal;
  const hasItems = cartItems.length > 0;

  // ==================== FRONT (CABEÇALHO) ====================
  // Cabeçalho superior com título MEU CARRINHO e botão Limpar
  // =============================================================

  const handleCheckout = () => {
    Alert.alert(
      'Finalizar compra',
      'Deseja realmente enviar seu pedido para o Drakos FC?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            addToPurchaseHistory(cartItems, total);
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

      {/* ==================== FRONT (CABEÇALHO) ==================== */}
      {/* Cabeçalho superior com botão voltar, título MEU CARRINHO e botão Limpar */}
      {/* ============================================================= */}
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MEU CARRINHO</Text>
        <TouchableOpacity onPress={() => hasItems && clearCart()}>
          <Text style={[styles.clearText, !hasItems && styles.clearTextDisabled]}>Limpar</Text>
        </TouchableOpacity>
      </View>

      {/* ==================== SCROLLVIEW (ITENS DO CARRINHO) ==================== */}
      {/* Lista rolável com os itens do carrinho ou estado vazio */}
      {/* ==================================================================== */}

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
              onRemove={removeItem}
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

      {/* ==================== BOTTOM BAR (TOTAL + CHECKOUT) ==================== */}
      {/* Barra inferior fixa com total e botão de compra (apenas se houver itens) */}
      {/* ====================================================================== */}

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

// styles moved to src/styles/styleCarrinhos/styleCarrinhos.js
