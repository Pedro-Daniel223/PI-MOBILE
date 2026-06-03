import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import MainStack from './stacks/MainStack';
import { CartProvider } from '../contexts/CartContext';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';

export default function Routes() {
  return (
    <CartProvider>
      <SubscriptionProvider>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </SubscriptionProvider>
    </CartProvider>
  );
}