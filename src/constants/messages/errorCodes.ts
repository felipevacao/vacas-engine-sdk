export const CODES = {
  // Autenticação
  MISSING_TOKEN: {
    name: 'MISSING_TOKEN', 
    message:'Token de autenticação não fornecido' 
  },
  INVALID_TOKEN: {
    name: 'INVALID_TOKEN', 
    message:'Token inválido' 
  },
  EXPIRED_TOKEN: {
    name: 'EXPIRED_TOKEN', 
    message:'Token expirado' 
  },
  INVALID_SESSION: {
    name: 'INVALID_SESSION', 
    message:'Sessão inválida' 
  },
  INVALID_CREDENTIALS: {
    name: 'INVALID_CREDENTIALS', 
    message:'Credenciais inválidas' 
  },
  TOKEN_VALIDATION_ERROR: {
    name: 'TOKEN_VALIDATION_ERROR', 
    message:'Erro durante a validação do token' 
  },
  INVALID_LOGIN: {
    name: 'INVALID_LOGIN', 
    message:'Login ou senha inválidos' 
  },
  ERROR_LOGIN: {
    name: 'ERROR_LOGIN', 
    message:'Erro ao verificar Login ou senha' 
  },


  // Autorização  
  UNAUTHORIZED: {
    name: 'UNAUTHORIZED', 
    message:'Acesso não autorizado' 
  },
  USER_NOT_FOUND: {
    name: 'USER_NOT_FOUND', 
    message:'Usuário não encontrado' 
  },

  // Validação
  INVALID_FORMAT: {
    name: 'INVALID_FORMAT', 
    message:'Formato inválido' 
  },
  INVALID_FILTER_FORMAT: {
    name: 'INVALID_FILTER_FORMAT', 
    message:'Formato de filtro inválido' 
  },

  // Recursos
  NOT_FOUND: {
    name: 'NOT_FOUND', 
    message:'Recurso não encontrado' 
  },

  // Sistema
  INTERNAL_ERROR: {
    name: 'INTERNAL_ERROR', 
    message:'Erro interno do servidor' 
  },
  OPERATION_ERROR: {
    name: 'OPERATION_ERROR', 
    message:'Erro na operação' 
  },
  UNKNOWN: {
    name: 'UNKNOWN', 
    message:'Erro desconhecido' 
  },
} as const;


// Type para as mensagens (útil para autocomplete no TypeScript)
export type ErrorCodes = typeof CODES;

// Export individual categories for more granular imports
export const ERROR = CODES;