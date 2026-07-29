import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getMinhaAssinatura } from '../services/subscriptionService';

const SubscriptionContext = createContext(null);

const normalizeSubscriptionPayload = (payload) => {
  if (!payload) {
    return null;
  }

  const source = payload.assinatura || payload.subscription || payload.plano || payload.plan || payload.categoria || payload;

  if (!source) {
    return null;
  }

  const title = source.title
    || source.nome_plano
    || source.nome
    || source.nome_categoria_clientes
    || null;

  const price = source.price
    ?? source.valor
    ?? source.preco
    ?? source.preco_categ
    ?? null;

  const planoId = source.plano_id
    ?? source.id
    ?? source.id_categoria_cliente
    ?? null;

  const tier = source.tier
    || (String(title || '').toLowerCase().includes('diamante') ? 'diamante' : null)
    || (String(title || '').toLowerCase().includes('ouro') ? 'ouro' : null)
    || (String(title || '').toLowerCase().includes('prata') ? 'prata' : null)
    || 'nao-socio';

  return {
    ...payload,
    ...source,
    plano_id: planoId,
    id: source.id ?? planoId,
    title,
    nome_plano: title,
    price,
    tier,
    status: source.status || payload.status || (title ? 'ativa' : 'nao_socio'),
    plan: source,
  };
};

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscription] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const { authenticated, token } = useAuth();

  const fetchSubscriptionFromServer = useCallback(async (providedToken) => {
    const currentToken = providedToken || token;

    if (!currentToken || !authenticated) {
      return null;
    }

    const response = await getMinhaAssinatura(currentToken);
    const normalized = normalizeSubscriptionPayload(response);
    setSubscription(normalized);
    return normalized;
  }, [authenticated, token]);

  const refreshSubscription = useCallback(async (providedToken) => {
    const currentToken = providedToken || token;

    if (!currentToken || !authenticated) {
      setSubscription(null);
      setLoadingSubscription(false);
      return null;
    }

    setLoadingSubscription(true);

    try {
      return await fetchSubscriptionFromServer(currentToken);
    } catch (error) {
      if (error?.status === 404) {
        setSubscription(null);
        return null;
      }

      if (error?.status === 401) {
        setSubscription(null);
        return null;
      }

      throw error;
    } finally {
      setLoadingSubscription(false);
    }
  }, [authenticated, fetchSubscriptionFromServer, token]);

  const syncSubscription = useCallback(async (options = {}) => {
    const providedToken = options?.providedToken || token;
    const expectedPlanId = options?.expectedPlanId != null ? Number(options.expectedPlanId) : null;
    const retries = Number.isFinite(Number(options?.retries)) ? Number(options.retries) : 3;

    if (!providedToken || !authenticated) {
      setSubscription(null);
      setLoadingSubscription(false);
      return null;
    }

    setLoadingSubscription(true);

    try {
      let normalized = null;

      for (let attempt = 0; attempt < retries; attempt += 1) {
        normalized = await fetchSubscriptionFromServer(providedToken);

        const activePlanId = Number(normalized?.plano_id ?? normalized?.id ?? normalized?.id_categoria_cliente);
        if (!Number.isFinite(expectedPlanId) || activePlanId === expectedPlanId) {
          break;
        }

        if (attempt < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
        }
      }

      return normalized;
    } catch (error) {
      if (error?.status === 404) {
        setSubscription(null);
        return null;
      }

      if (error?.status === 401) {
        setSubscription(null);
        return null;
      }

      throw error;
    } finally {
      setLoadingSubscription(false);
    }
  }, [authenticated, fetchSubscriptionFromServer, token]);

  useEffect(() => {
    let cancelled = false;

    const loadSubscription = async () => {
      if (!authenticated || !token) {
        setSubscription(null);
        if (!cancelled) {
          setLoadingSubscription(false);
        }
        return;
      }

      try {
        await refreshSubscription(token);
      } catch {
        // Mantém o estado anterior e deixa a UI seguir com a sessão atual.
      } finally {
        if (!cancelled) {
          setLoadingSubscription(false);
        }
      }
    };

    loadSubscription();

    return () => {
      cancelled = true;
    };
  }, [authenticated, refreshSubscription, token]);

  const confirmSubscription = (plan) => {
    const now = new Date();
    const normalized = normalizeSubscriptionPayload(plan);
    const entry = {
      id: Date.now(),
      type: 'subscription',
      planTitle: normalized?.title || plan?.title,
      price: normalized?.price || plan?.price,
      date: now.toISOString(),
    };
    setSubscription(normalized || plan);
    setPurchaseHistory((prev) => [entry, ...prev]);
  };

  const addToPurchaseHistory = (items, total) => {
    const safeItems = Array.isArray(items) ? items : [];
    const now = new Date();
    const entry = {
      id: Date.now() + Math.random(),
      type: 'purchase',
      title: safeItems.length > 1 ? `${safeItems.length} produtos` : '1 produto',
      items: safeItems.map(item => item.nome || 'Produto'),
      itemImages: safeItems.map(item => {
        if (Array.isArray(item.imagens) && item.imagens.length > 0) return item.imagens[0];
        if (item.imagem) return item.imagem;
        if (item.image) return item.image;
        if (item.imageUrl) return item.imageUrl;
        return null;
      }),
      price: total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      date: now.toISOString(),
    };
    setPurchaseHistory((prev) => [entry, ...prev]);
  };

  const value = {
    subscription,
    setSubscription,
    loadingSubscription,
    refreshSubscription,
    syncSubscription,
    purchaseHistory,
    confirmSubscription,
    addToPurchaseHistory,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}
