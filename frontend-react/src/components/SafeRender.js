import React from 'react';

/**
 * SafeRender é um componente utilitário que renderiza conteúdo com fallback seguro
 */
function SafeRender({ children, fallback = null }) {
  try {
    return children;
  } catch (error) {
    console.error('SafeRender error:', error);
    return fallback || <div className="error">Erro ao renderizar conteúdo</div>;
  }
}

export default SafeRender;
