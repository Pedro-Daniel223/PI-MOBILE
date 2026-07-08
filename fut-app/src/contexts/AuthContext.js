import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { cadastro, login, logout, meuPerfil } from '../services/authService';

const AUTH_TOKEN_KEY = 'auth_token';

const AuthContext = createContext(null);

const extractToken = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const possibleTokens = [
    payload.token,
    payload.accessToken,
    payload.access_token,
    payload.authToken,
    payload.auth_token,
    payload.data?.token,
    payload.data?.accessToken,
    payload.data?.access_token,
    payload.result?.token,
    payload.result?.accessToken,
  ];

  return possibleTokens.find((value) => typeof value === 'string' && value.trim()) || null;
};

const extractCliente = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const possibleCliente = [
    payload.cliente,
    payload.user,
    payload.usuario,
    payload.profile,
    payload.data?.cliente,
    payload.data?.user,
    payload.data?.usuario,
    payload.data?.profile,
    payload.result?.cliente,
    payload.result?.user,
    payload.result?.usuario,
    payload.result?.profile,
  ];

  return possibleCliente.find(Boolean) || null;
};

const isTokenError = (error) => {
  const message = String(error?.message || '').toLowerCase();
  return (
    message.includes('401') ||
    message.includes('unauthorized') ||
    message.includes('token') ||
    message.includes('credencial') ||
    message.includes('autent')
  );
};

export function AuthProvider({ children }) {
  const [cliente, setCliente] = useState(null);
  const [token, setToken] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const clearAuthState = useCallback(async (shouldRemoveStoredToken = true) => {
    setCliente(null);
    setToken(null);
    setAuthenticated(false);

    if (shouldRemoveStoredToken) {
      try {
        await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      } catch {
        // Ignora falhas de limpeza local para não travar o fluxo.
      }
    }
  }, []);

  const persistToken = useCallback(async (nextToken) => {
    if (!nextToken) {
      return null;
    }

    setToken(nextToken);

    try {
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, nextToken);
    } catch (error) {
      await clearAuthState(false);
      throw error;
    }

    return nextToken;
  }, [clearAuthState]);

  const applySession = useCallback((nextCliente, nextToken) => {
    if (nextCliente) {
      setCliente(nextCliente);
    }

    if (nextToken) {
      setToken(nextToken);
      setAuthenticated(true);
    } else if (nextCliente) {
      setAuthenticated(true);
    }
  }, []);

  const loadUser = useCallback(async (providedToken) => {
    setLoading(true);

    try {
      const storedToken = providedToken || (await SecureStore.getItemAsync(AUTH_TOKEN_KEY));

      if (!storedToken) {
        await clearAuthState(true);
        return null;
      }

      setToken(storedToken);

      const response = await meuPerfil(storedToken);
      const nextCliente = extractCliente(response) || response || null;

      setCliente(nextCliente);
      setAuthenticated(true);

      return response;
    } catch (error) {
      await clearAuthState(true);

      if (!isTokenError(error)) {
        throw error;
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [clearAuthState]);

  const signIn = useCallback(async (email, senha) => {
    setLoading(true);

    try {
      const response = await login({ email, senha });
      const nextToken = extractToken(response);
      const nextCliente = extractCliente(response);

      if (nextToken) {
        await persistToken(nextToken);
      }

      if (nextCliente) {
        applySession(nextCliente, nextToken);
      }

      if (!nextCliente && nextToken) {
        await loadUser(nextToken);
      }

      if (!nextToken && !nextCliente) {
        setAuthenticated(false);
      }

      return response;
    } catch (error) {
      await clearAuthState(true);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [applySession, clearAuthState, loadUser, persistToken]);

  const signUp = useCallback(async (dadosCadastro) => {
    setLoading(true);

    try {
      const response = await cadastro(dadosCadastro);
      const nextToken = extractToken(response);
      const nextCliente = extractCliente(response);

      if (nextToken) {
        await persistToken(nextToken);
      }

      if (nextCliente) {
        applySession(nextCliente, nextToken);
      }

      if (!nextCliente && nextToken) {
        await loadUser(nextToken);
      }

      return response;
    } catch (error) {
      await clearAuthState(true);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [applySession, clearAuthState, loadUser, persistToken]);

  const signOut = useCallback(async () => {
    setLoading(true);

    try {
      const currentToken = token || (await SecureStore.getItemAsync(AUTH_TOKEN_KEY));

      if (currentToken) {
        await logout(currentToken);
      }
    } catch (error) {
      // Mantém o logout local mesmo se o backend falhar.
      await clearAuthState(true);
      throw error;
    } finally {
      await clearAuthState(true);
      setLoading(false);
    }
  }, [clearAuthState, token]);

  useEffect(() => {
    loadUser().catch(() => {
      // O load inicial já limpa estado e SecureStore quando necessário.
    });
  }, [loadUser]);

  const value = {
    cliente,
    token,
    authenticated,
    loading,
    signIn,
    signUp,
    signOut,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
