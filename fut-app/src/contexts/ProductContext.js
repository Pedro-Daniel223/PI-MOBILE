import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getProductById as fetchProductById, loadProducts as fetchProducts } from '../services/productService';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestRef = useRef(0);

  const loadProducts = useCallback(async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    setError(null);

    try {
      const nextProducts = await fetchProducts();

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
  }, []);

  const getProductById = useCallback(async (id) => {
    if (!id) {
      return null;
    }

    const cachedProduct = products.find((product) => String(product.id) === String(id));
    if (cachedProduct) {
      return cachedProduct;
    }

    return fetchProductById(id);
  }, [products]);

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
