import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  clearCachedProducts,
  getProductById as fetchProductById,
  loadProducts as fetchProducts,
} from '../services/productService';
import { useAuth } from './AuthContext';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestRef = useRef(0);
  const { token } = useAuth();

  const loadProducts = useCallback(async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    setError(null);

    try {
      const nextProducts = await fetchProducts(token);

      if (requestId !== requestRef.current) {
        return nextProducts;
      }

      setProducts(nextProducts);
      return nextProducts;
    } catch (err) {
      if (requestId === requestRef.current) {
        setError(err);
      }

      throw err;
    } finally {
      if (requestId === requestRef.current) {
        setLoading(false);
      }
    }
  }, [token]);

  const refreshProducts = useCallback(async () => {
    clearCachedProducts();
    return loadProducts();
  }, [loadProducts]);

  const getProductById = useCallback(async (id) => {
    if (!id) {
      return null;
    }

    const cachedProduct = products.find((product) => String(product.id) === String(id));
    if (cachedProduct) {
      return cachedProduct;
    }

    return fetchProductById(id, token);
  }, [products, token]);

  useEffect(() => {
    loadProducts().catch(() => {
      // Mantém a tela funcionando com a última lista disponível.
    });
  }, [loadProducts]);

  const value = {
    products,
    loading,
    error,
    loadProducts,
    refreshProducts,
    getProductById,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }

  return context;
}
