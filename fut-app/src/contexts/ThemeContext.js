import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@fut_app/theme';

const ThemeContext = createContext(null);

const normalizeScheme = (scheme) => (scheme === 'light' ? 'light' : 'dark');

const isValidTheme = (value) => value === 'light' || value === 'dark';

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState(() => normalizeScheme(systemScheme));
  const [hasStoredTheme, setHasStoredTheme] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (!mounted) {
          return;
        }

        if (isValidTheme(storedTheme)) {
          setTheme(storedTheme);
          setHasStoredTheme(true);
          return;
        }

        setTheme(normalizeScheme(systemScheme));
        setHasStoredTheme(false);
      } catch {
        if (mounted) {
          setTheme(normalizeScheme(systemScheme));
          setHasStoredTheme(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasStoredTheme) {
      setTheme(normalizeScheme(systemScheme));
    }
  }, [hasStoredTheme, systemScheme]);

  const persistTheme = useCallback(async (nextTheme) => {
    const normalizedTheme = normalizeScheme(nextTheme);
    setTheme(normalizedTheme);
    setHasStoredTheme(true);

    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, normalizedTheme);
    } catch {
      // Mantém o tema em memória mesmo se a persistência local falhar.
    }
  }, []);

  const toggleTheme = useCallback(async () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    await persistTheme(nextTheme);
  }, [persistTheme, theme]);

  const value = useMemo(() => ({
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggleTheme,
    setTheme: persistTheme,
  }), [persistTheme, theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
