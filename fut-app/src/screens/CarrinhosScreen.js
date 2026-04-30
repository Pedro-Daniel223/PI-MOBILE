import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,
  StatusBar, Dimensions, Alert, Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../contexts/CartContext';

const { width } = Dimensions.get('window');

const theme = {
  background: '#181818',
  surface: '#FFFFFF',
  surfaceSecondary: '#EFEFEF',
  text: '#000000',
  textSecondary: '#E6E6E6',
  textAccent: '#0A0A0A',
  border: 'rgba(230, 230, 230, 0.9)',
  accent: '#880000',
  error: '#FFE9E9',
  success: '#2ED573',
};

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [scaleAnim] = useState(new Animated.Value(1));

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

  return (
    <Animated.View style={[styles.cartItem, { transform: [{ scale: scaleAnim }] }]}>
      <LinearGradient
        colors={['#FFFFFF', '#EFEFEF']}
        style={styles.cartItemGradient}
      >
        <View style={styles.cartItemContent}>
          <View style={styles.imageContainer}>
            <Image source={item.imagem} style={styles.cartItemImage} resizeMode="contain" />
            <View style={styles.imageOverlay} />
          </View>

          <View style={styles.cartItemInfo}>
            <Text style={styles.cartItemTitle}>Descrição do pedido:</Text>
            <Text style={styles.cartItemName} numberOfLines={2}>{item.nome}</Text>
            <View style={styles.detailsRow}>
              <Text style={styles.cartItemDetail}>
                <Text style={styles.cartItemLabel}>Tamanho: </Text>
                <Text style={styles.detailValue}>{item.tamanho}</Text>
              </Text>
              <Text style={styles.cartItemDetail}>
                <Text style={styles.cartItemLabel}>Qtd: </Text>
                <Text style={styles.detailValue}>{item.quantity}</Text>
              </Text>
            </View>

            <View style={styles.cartItemFooter}>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={[styles.quantityButton, styles.quantityButtonLeft]}
                  onPress={() => onUpdateQuantity(item.id, item.tamanho, item.quantity - 1)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quantitySymbol}>-</Text>
                </TouchableOpacity>

                <View style={styles.quantityDivider} />

                <Text style={styles.quantityText}>{item.quantity}</Text>

                <View style={styles.quantityDivider} />

                <TouchableOpacity
                  style={[styles.quantityButton, styles.quantityButtonRight]}
                  onPress={() => onUpdateQuantity(item.id, item.tamanho, item.quantity + 1)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quantitySymbol}>+</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemove(item.id, item.tamanho)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={16} color="#FFE9E9" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default function CarrinhosScreen({ navigation }) {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [floatingAnim] = useState(new Animated.Value(0));

  const total = getCartTotal();
  const hasItems = cartItems.length > 0;

  React.useEffect(() => {
    Animated.spring(floatingAnim, {
      toValue: hasItems ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [hasItems]);

  const handleCheckout = () => {
    Alert.alert(
      'Finalizar Compra',
      'Deseja finalizar a compra?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            clearCart();
            Alert.alert('✅ Sucesso!', 'Compra realizada com sucesso!');
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back-outline" size={24} color="#0A0A0A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CARRINHO</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {hasItems ? (
          <>
            {/* Cart Items */}
            <View style={styles.cartItemsContainer}>
              {cartItems.map((item, index) => (
                <CartItem
                  key={`${item.id}-${item.tamanho}`}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </View>
          </>
        ) : (
          /* Empty Cart */
          <View style={styles.emptyCart}>
            <LinearGradient
              colors={['#880000', '#0A0A0A']}
              style={styles.emptyCartIconContainer}
            >
              <Ionicons name="cart-outline" size={60} color="#FFF" />
            </LinearGradient>
            <Text style={styles.emptyCartTitle}>Seu carrinho está vazio</Text>
            <Text style={styles.emptyCartText}>
              Adicione produtos incríveis para começar suas compras
            </Text>
            <TouchableOpacity
              style={styles.shopButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Loja')}
            >
              <LinearGradient
                colors={['#880000', '#0A0A0A']}
                style={styles.shopButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.shopButtonText}>Ir às Compras</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Floating Bar */}
      {hasItems && (
        <Animated.View
          style={[
            styles.floatingBar,
            {
              transform: [{
                translateY: floatingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                })
              }],
              opacity: floatingAnim,
            }
          ]}
        >
          <LinearGradient
            colors={['#FFFFFF', '#EFEFEF']}
            style={styles.floatingGradient}
          >
            <View style={styles.floatingContent}>
              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>
                  {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.buyButton}
                activeOpacity={0.8}
                onPress={handleCheckout}
              >
                <LinearGradient
                  colors={['#0A0A0A', '#000000']}
                  style={styles.buyButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.buyButtonContent}>
                    <Ionicons name="bag-handle-outline" size={20} color="#FFF" />
                    <Text style={styles.buyButtonText}>Comprar</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      position: 'relative',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '900',
      color: theme.text,
      letterSpacing: 3,
      textTransform: 'uppercase',
      textShadowColor: 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    iconButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    scrollContent: {
      paddingBottom: 140,
    },
    cartItemsContainer: {
      paddingHorizontal: 0,
    },
    cartItem: {
      marginHorizontal: 20,
      marginBottom: 16,
      borderRadius: 24,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 12,
      overflow: 'hidden',
    },
    cartItemGradient: {
      borderRadius: 24,
    },
    cartItemContent: {
      flexDirection: 'row',
      padding: 20,
    },
    imageContainer: {
      position: 'relative',
    },
    cartItemImage: {
      width: 85,
      height: 85,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: theme.surface,
    },
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(136, 0, 0, 0.05)',
      borderRadius: 16,
    },
    cartItemInfo: {
      flex: 1,
      marginLeft: 16,
    },
    cartItemTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.accent,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 6,
    },
    cartItemName: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 10,
      lineHeight: 22,
    },
    detailsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    cartItemDetail: {
      fontSize: 13,
      color: theme.textSecondary,
      flex: 1,
    },
    cartItemLabel: {
      fontWeight: '600',
      color: theme.textAccent,
    },
    detailValue: {
      color: theme.text,
      fontWeight: '500',
    },
  cartItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6E6E6',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonLeft: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quantityButtonRight: {
    backgroundColor: '#880000',
    shadowColor: '#880000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  quantityDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E6E6E6',
    marginHorizontal: 8,
  },
  quantitySymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A0A0A',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE9E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#FFE9E9',
    shadowColor: '#FFE9E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  floatingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: theme.accent,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
    overflow: 'hidden',
  },
  floatingGradient: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 32,
  },
  floatingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalSection: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 13,
    color: '#E6E6E6',
    marginBottom: 4,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.5,
  },
  buyButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: theme.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  buyButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  emptyCartIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#E6E6E6',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    maxWidth: 280,
  },
  shopButton: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: theme.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  shopButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});