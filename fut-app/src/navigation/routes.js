import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import MainStack from './stacks/MainStack';
import AuthStack from './stacks/AuthStack';
import { useAuth } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';

export default function Routes() {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <CartProvider>
      <SubscriptionProvider>
        <NavigationContainer>
          {authenticated ? <MainStack /> : <AuthStack />}
        </NavigationContainer>
      </SubscriptionProvider>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
