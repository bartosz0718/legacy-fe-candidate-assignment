import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type SignedItem = {
  id: string;
  message: string;
  signature: string;
  address: string | null;
  ts: number;
};

type Ctx = {
  items: SignedItem[];
  add: (item: Omit<SignedItem, 'id' | 'ts'>) => void;
  clear: () => void;
};

const KEY = 'sign-history-v1';
const LocalHistoryContext = createContext<Ctx | undefined>(undefined);

export function LocalHistoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SignedItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) as SignedItem[] : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      // ignore write errors
    }
  }, [items]);

  // Reflect external changes (e.g., other tabs)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY) return;
      try {
        const next = e.newValue ? JSON.parse(e.newValue) as SignedItem[] : [];
        setItems(prev => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
      } catch {
        // ignore parse errors
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback((item: Omit<SignedItem, 'id' | 'ts'>) => {
    const record: SignedItem = {
      id: crypto.randomUUID(),
      ts: Date.now(),
      ...item
    };
    setItems(prev => [record, ...prev].slice(0, 50));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<Ctx>(() => ({ items, add, clear }), [items, add, clear]);

  return (
    <LocalHistoryContext.Provider value={value}>
      {children}
    </LocalHistoryContext.Provider>
  );
}

export function useLocalHistory() {
  const ctx = useContext(LocalHistoryContext);
  if (!ctx) throw new Error('useLocalHistory must be used within LocalHistoryProvider');
  return ctx;
}