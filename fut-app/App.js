import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Routes from './src/navigation/routes';
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
