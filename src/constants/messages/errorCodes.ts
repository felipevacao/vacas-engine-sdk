export const CODES = {
  // Autenticação
  MISSING_TOKEN: 'Token de autenticação não fornecido',
  INVALID_TOKEN: 'Token inválido',
  EXPIRED_TOKEN: 'Token expirado',
  INVALID_SESSION: 'Sessão inválida',
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  TOKEN_VALIDATION_ERROR: 'Erro durante a validação do token',
  INVALID_LOGIN: 'Login ou senha inválidos',
  ERROR_LOGIN: 'Erro ao verificar Login ou senha',


  // Autorização  
  UNAUTHORIZED: 'Acesso não autorizado',

  // Validação
  INVALID_FORMAT: 'Formato inválido',

  // Recursos
  NOT_FOUND: 'Recurso não encontrado',

  // Sistema
  INTERNAL_ERROR: 'Erro interno do servidor',
  OPERATION_ERROR: 'Erro na operação',
  UNKNOWN: 'Erro desconhecido',
} as const;


// Type para as mensagens (útil para autocomplete no TypeScript)
export type ErrorCodes = typeof CODES;

// Export individual categories for more granular imports
export const ERROR_CODES = CODES;