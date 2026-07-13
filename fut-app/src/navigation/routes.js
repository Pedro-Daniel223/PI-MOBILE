import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { NavigationContainer } from '@react-navigation/native';

import MainStack from './stacks/MainStack';
import AuthStack from './stacks/AuthStack';
import { useAuth } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';

const ONBOARDING_KEY = 'onboarding_seen';

export default function Routes() {
  const { authenticated, loading } = useAuth();
  const [onboardingSeen, setOnboardingSeen] = useState(false);
  const [loadingOnboarding, setLoadingOnboarding] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoadingOnboarding(true);

    (async () => {
      try {
        const storedValue = await SecureStore.getItemAsync(ONBOARDING_KEY);
        if (mounted) {
          setOnboardingSeen(storedValue === 'true');
        }
      } finally {
        if (mounted) {
          setLoadingOnboarding(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [authenticated]);

  if (loading || loadingOnboarding) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const shouldShowMainStack = authenticated || !onboardingSeen;

  return (
    <CartProvider>
      <SubscriptionProvider>
        <NavigationContainer>
          {shouldShowMainStack ? (
            <MainStack key={authenticated ? 'main-auth' : 'main-guest'} />
          ) : (
            <AuthStack />
          )}
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
