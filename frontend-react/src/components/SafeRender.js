import React from 'react';

/**
 * SafeRender - Componente que renderiza dados com segurança
 * Evita erros ao tentar renderizar objetos inválidos
 */
function SafeRender({ value, fallback = '-' }) {
  // Se é null, undefined ou um objeto (não primitivo)
  if (value === null || value === undefined) {
    return <span>{fallback}</span>;
  }

  // Se é um objeto
  if (typeof value === 'object') {
    // Se tem propriedades específicas do backend, extrair valor legível
    if (value.name) return <span>{value.name}</span>;
    if (value.title) return <span>{value.title}</span>;
    if (value.value) return <span>{value.value}</span>;

    // Se é array, juntar com vírgula
    if (Array.isArray(value)) {
      return <span>{value.join(', ')}</span>;
    }

    // Se é um objeto vazio ou inválido
    return <span>{fallback}</span>;
  }

  // Se é um tipo primitivo (string, number, boolean)
  return <span>{String(value)}</span>;
}

export default SafeRender;

