import React, { createContext, useContext, useState } from 'react';

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscription] = useState(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);

  const confirmSubscription = (plan) => {
    const now = new Date();
    const entry = {
      id: Date.now(),
      planTitle: plan.title,
      price: plan.price,
      date: now.toISOString(),
    };
    setSubscription(plan);
    setSubscriptionHistory((prev) => [entry, ...prev]);
  };

  return (
    <SubscriptionContext.Provider
      value={{ subscription, subscriptionHistory, confirmSubscription }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}
