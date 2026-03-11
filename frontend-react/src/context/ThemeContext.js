import React, { createContext, useState, useContext, useEffect } from 'react';

// Criar o contexto
const ThemeContext = createContext();

// Provider
export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState(() => {
    // Obter tema do localStorage ou usar 'default' como fallback
    return localStorage.getItem('sololeveling_theme') || 'default';
  });

  // Atualizar localStorage quando o tema muda
  useEffect(() => {
    localStorage.setItem('sololeveling_theme', themeName);
  }, [themeName]);

  const toggleTheme = () => {
    setThemeName((prev) => (prev === 'default' ? 'arise' : 'default'));
  };

  const setTheme = (newTheme) => {
    if (['default', 'arise'].includes(newTheme)) {
      setThemeName(newTheme);
    }
  };

  const value = {
    themeName,
    toggleTheme,
    setTheme,
    isAriseTheme: themeName === 'arise',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para usar o contexto
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
};

export default ThemeContext;
