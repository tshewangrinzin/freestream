import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || 'dark';
  });

  useEffect(() => {
    // Disable transitions initially
    document.documentElement.classList.add('theme-transition-disabled');

    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Enable transitions after a short delay to prevent initial animation
    const enableTransitions = () => {
      document.documentElement.classList.remove('theme-transition-disabled');
      document.documentElement.classList.add('theme-transition');
    };

    // Store theme preference
    localStorage.setItem('theme', theme);

    // Small delay to ensure transitions are smooth
    const transitionTimeout = setTimeout(enableTransitions, 50);

    // Cleanup
    return () => {
      clearTimeout(transitionTimeout);
      document.documentElement.classList.remove('theme-transition');
    };
  }, [theme]);

  const toggleTheme = () => {
    // Add transition class before theme change
    document.documentElement.classList.add('theme-transition');
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}