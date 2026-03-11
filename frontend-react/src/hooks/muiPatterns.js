/**
 * PADRÕES E HOOKS ÚTEIS PARA MUI + SOLO LEVELING
 * Exemplos práticos de como usar MUI eficientemente
 */

import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '../context/ThemeContext';

/**
 * Hook: useResponsive
 * Detecta breakpoints do MUI
 */
export function useResponsive() {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return { isMobile, isTablet, isDesktop };
}

/**
 * Hook: useThemeColors
 * Acessa cores do tema MUI
 */
export function useThemeColors() {
  const muiTheme = useMuiTheme();
  const { themeName } = useTheme();

  return {
    primary: muiTheme.palette.primary.main,
    secondary: muiTheme.palette.secondary.main,
    success: muiTheme.palette.success.main,
    warning: muiTheme.palette.warning.main,
    error: muiTheme.palette.error.main,
    background: muiTheme.palette.background.default,
    paper: muiTheme.palette.background.paper,
    text: muiTheme.palette.text.primary,
    textSecondary: muiTheme.palette.text.secondary,
    themeName,
  };
}

/**
 * Padrão: Styled Component com SX
 * Reutilizar estilos em múltiplos componentes
 */
export const commonStyles = {
  card: {
    borderRadius: 2,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: 4,
      transform: 'translateY(-4px)',
    },
  },

  button: {
    textTransform: 'capitalize',
    fontWeight: 600,
    letterSpacing: 0.5,
  },

  input: {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: 'primary.main',
      },
    },
  },

  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
    px: 1.5,
    py: 0.5,
    borderRadius: 1,
    fontSize: '0.75rem',
    fontWeight: 600,
  },

  fadeIn: {
    animation: 'fadeIn 0.3s ease',
    '@keyframes fadeIn': {
      '0%': { opacity: 0, transform: 'translateY(10px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
  },

  shimmer: {
    animation: 'shimmer 2s infinite',
    '@keyframes shimmer': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.7 },
    },
  },
};

/**
 * Padrão: Custom Components com Props do MUI
 * Componentizar com flexibilidade
 */
export function LoadingCard({ children, loading, ...props }) {
  return (
    <Card {...props}>
      {loading && (
        <Box sx={commonStyles.shimmer}>
          <Skeleton variant="rectangular" height={200} />
        </Box>
      )}
      {!loading && <CardContent>{children}</CardContent>}
    </Card>
  );
}

/**
 * Padrão: Conditional Rendering com Chips
 * Status visual com mínimo de código
 */
export const statusChipMap = {
  pending: { label: 'Pendente', color: 'default' },
  in_progress: { label: 'Em Progresso', color: 'info' },
  completed: { label: 'Concluído', color: 'success' },
  cancelled: { label: 'Cancelado', color: 'error' },
};

export function StatusChip({ status, ...props }) {
  const config = statusChipMap[status] || statusChipMap.pending;
  return <Chip {...config} size="small" {...props} />;
}

/**
 * Padrão: Grid Responsivo Reutilizável
 * Layout consistente em todas as páginas
 */
export const gridConfig = {
  spacing: { xs: 1, sm: 2, md: 3 },
  columns: { xs: 1, sm: 2, md: 3, lg: 4 },
};

/**
 * Padrão: Snackbar para mensagens
 * Notificações simples e rápidas
 */
import { Snackbar, Alert } from '@mui/material';
import { useState } from 'react';

export function useSnackbar() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info'); // success, error, warning, info

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const SnackbarComponent = () => (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );

  return { showMessage, SnackbarComponent };
}

/**
 * Padrão: Form com validação
 * Validar fields e mostrar erros
 */
export function useForm(initialValues, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você validaria os valores
    onSubmit(values);
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors,
  };
}

/**
 * Padrão: Modal/Dialog Customizado
 * Reuse em múltiplos lugares
 */
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export function useDialog() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);

  const openDialog = (content) => {
    setData(content);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setData(null);
  };

  const DialogComponent = ({ title, onConfirm }) => (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{data}</DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancelar</Button>
        <Button
          onClick={() => {
            onConfirm?.();
            closeDialog();
          }}
          variant="contained"
          color="primary"
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );

  return { open, openDialog, closeDialog, DialogComponent };
}

/**
 * Padrão: Tema Dinâmico
 * Mudar cores baseado em tema
 */
export function getDynamicStyles(themeName) {
  return {
    primaryGradient:
      themeName === 'arise'
        ? 'linear-gradient(135deg, #7c5cff, #00d9ff)'
        : 'linear-gradient(135deg, #3b82f6, #22ff88)',
    
    shadowColor:
      themeName === 'arise'
        ? 'rgba(124, 92, 255, 0.3)'
        : 'rgba(59, 130, 246, 0.3)',
  };
}

/**
 * Padrão: Table com Sorting e Filtering
 * Dados tabulares avançados
 */
export function useTableState(initialData) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    data,
    setData,
    page,
    rowsPerPage,
    order,
    orderBy,
    handleSort,
    handleChangePage,
    handleChangeRowsPerPage,
  };
}

export default {
  useResponsive,
  useThemeColors,
  commonStyles,
  statusChipMap,
  StatusChip,
  gridConfig,
  useSnackbar,
  useForm,
  useDialog,
  getDynamicStyles,
  useTableState,
};
