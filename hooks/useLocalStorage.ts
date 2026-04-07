"use client";

import { useEffect, useRef, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialValueRef = useRef(initialValue);
  const [storedValue, setStoredValue] = useState(initialValueRef.current);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);

      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch {
      setStoredValue(initialValueRef.current);
    } finally {
      setHasLoaded(true);
    }
  }, [key]);

  useEffect(() => {
    if (!hasLoaded) return;

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Ignore storage write failures to keep the UI responsive.
    }
  }, [hasLoaded, key, storedValue]);

  return [storedValue, setStoredValue, hasLoaded] as const;
}
