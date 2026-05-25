import React, { createContext, useContext, useState } from 'react';

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscription] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  const confirmSubscription = (plan) => {
    const now = new Date();
    const entry = {
      id: Date.now(),
      type: 'subscription',
      planTitle: plan.title,
      price: plan.price,
      date: now.toISOString(),
    };
    setSubscription(plan);
    setPurchaseHistory((prev) => [entry, ...prev]);
  };

  const addToPurchaseHistory = (items, total) => {
    const now = new Date();
    const entry = {
      id: Date.now() + Math.random(),
      type: 'purchase',
      title: items.length > 1 ? `${items.length} produtos` : '1 produto',
      items: items.map(item => item.nome || 'Produto'),
      price: total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      date: now.toISOString(),
    };
    setPurchaseHistory((prev) => [entry, ...prev]);
  };

  const value = {
    subscription,
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
