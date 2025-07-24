
import { useState, useEffect } from 'react';

export function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // 1. Initialize state from localStorage or use the initialValue.
  // This function is only executed on the initial render.
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 2. Use a useEffect to synchronize the state to localStorage whenever it changes.
  // This separates the state update from the side effect of writing to storage.
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // 3. Listen for changes to the same key from other tabs/windows.
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          if (e.newValue) {
            setStoredValue(JSON.parse(e.newValue));
          } else {
            // The item was removed from storage in another tab.
            setStoredValue(initialValue);
          }
        } catch (error) {
          console.error(`Error parsing storage change for key "${key}":`, error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]); // Dependencies are stable, so this effect runs once on mount.

  // The returned setter is the original one from `useState`, which is stable
  // and supports functional updates automatically.
  return [storedValue, setStoredValue];
}
