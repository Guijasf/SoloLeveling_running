import { createTheme } from '@mui/material/styles';

// Cores do tema Default (Original)
export const defaultThemeColors = {
  bg: '#0a0f1b',
  card: '#0f1623',
  green: '#22ff88',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  orange: '#ff6b35',
  text: '#e5e7eb',
  textSoft: '#a1a5b0',
  border: '#1f2937',
};

// Cores do tema ARISE (Purple/Cyan)
export const ariseThemeColors = {
  bg: '#1a1626',
  card: '#2d1f3f',
  green: '#00d9ff',
  blue: '#7c5cff',
  purple: '#9d4edd',
  orange: '#ff006e',
  text: '#f0f0f0',
  textSoft: '#b0b0c0',
  border: '#3d2d5f',
};

// Tema Default
export const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: defaultThemeColors.blue,
      light: '#60a5fa',
      dark: '#1e40af',
    },
    secondary: {
      main: defaultThemeColors.purple,
      light: '#a78bfa',
      dark: '#6d28d9',
    },
    success: {
      main: defaultThemeColors.green,
      light: '#4ade80',
      dark: '#15803d',
    },
    warning: {
      main: defaultThemeColors.orange,
      light: '#fb923c',
      dark: '#c2410c',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#991b1b',
    },
    background: {
      default: defaultThemeColors.bg,
      paper: defaultThemeColors.card,
    },
    text: {
      primary: defaultThemeColors.text,
      secondary: defaultThemeColors.textSoft,
    },
    divider: defaultThemeColors.border,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 800,
      color: defaultThemeColors.text,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      color: defaultThemeColors.text,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: defaultThemeColors.text,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: defaultThemeColors.text,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      color: defaultThemeColors.text,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: defaultThemeColors.text,
    },
    body1: {
      fontSize: '0.875rem',
      color: defaultThemeColors.text,
    },
    body2: {
      fontSize: '0.75rem',
      color: defaultThemeColors.textSoft,
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            color: defaultThemeColors.text,
            '& fieldset': {
              borderColor: defaultThemeColors.border,
            },
            '&:hover fieldset': {
              borderColor: defaultThemeColors.blue,
            },
            '&.Mui-focused fieldset': {
              borderColor: defaultThemeColors.blue,
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '8px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: `0 0 12px rgba(59, 130, 246, 0.4)`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: defaultThemeColors.card,
          borderColor: defaultThemeColors.border,
          border: `1px solid ${defaultThemeColors.border}`,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: defaultThemeColors.border,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: defaultThemeColors.blue,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: defaultThemeColors.blue,
          },
        },
      },
    },
  },
});

// Tema ARISE
export const ariseTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: ariseThemeColors.blue,
      light: '#9d7be8',
      dark: '#5a40cc',
    },
    secondary: {
      main: ariseThemeColors.purple,
      light: '#b55ecc',
      dark: '#7d2c9f',
    },
    success: {
      main: ariseThemeColors.green,
      light: '#26e5ff',
      dark: '#0099bb',
    },
    warning: {
      main: ariseThemeColors.orange,
      light: '#ff3382',
      dark: '#cc0055',
    },
    error: {
      main: '#ff1b6d',
      light: '#ff4d8f',
      dark: '#cc0055',
    },
    background: {
      default: ariseThemeColors.bg,
      paper: ariseThemeColors.card,
    },
    text: {
      primary: ariseThemeColors.text,
      secondary: ariseThemeColors.textSoft,
    },
    divider: ariseThemeColors.border,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 800,
      color: ariseThemeColors.text,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      color: ariseThemeColors.text,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: ariseThemeColors.text,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: ariseThemeColors.text,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      color: ariseThemeColors.text,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: ariseThemeColors.text,
    },
    body1: {
      fontSize: '0.875rem',
      color: ariseThemeColors.text,
    },
    body2: {
      fontSize: '0.75rem',
      color: ariseThemeColors.textSoft,
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            color: ariseThemeColors.text,
            '& fieldset': {
              borderColor: ariseThemeColors.border,
            },
            '&:hover fieldset': {
              borderColor: ariseThemeColors.blue,
            },
            '&.Mui-focused fieldset': {
              borderColor: ariseThemeColors.blue,
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '8px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: `0 0 12px rgba(124, 92, 255, 0.4)`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: ariseThemeColors.card,
          borderColor: ariseThemeColors.border,
          border: `1px solid ${ariseThemeColors.border}`,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: ariseThemeColors.border,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: ariseThemeColors.blue,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: ariseThemeColors.blue,
          },
        },
      },
    },
  },
});

// Função auxiliar para obter o tema baseado no nome
export const getTheme = (themeName = 'default') => {
  return themeName === 'arise' ? ariseTheme : defaultTheme;
};

export default defaultTheme;
