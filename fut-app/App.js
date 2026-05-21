import React from 'react';

import { CartProvider } from './src/contexts/CartContext';

import Routes from './src/navigation/routes';

export default function App() {
  return (
    <CartProvider>
      <Routes />
    </CartProvider>
  );
}