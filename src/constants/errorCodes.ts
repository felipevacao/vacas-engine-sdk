// constants/error-codes.ts
export const ERROR_CODES = {
  // Autenticação
  MISSING_TOKEN: 'Token de autenticação não fornecido',
  INVALID_TOKEN: 'Token inválido',
  EXPIRED_TOKEN: 'Token expirado',
  INVALID_SESSION: 'Sessão inválida',
  
  // Autorização  
  UNAUTHORIZED: 'Acesso não autorizado',
  FORBIDDEN: 'Acesso negado',
  
  // Validação
  VALIDATION_ERROR: 'Dados de entrada inválidos',
  MISSING_REQUIRED_FIELD: 'Campo obrigatório não informado',
  INVALID_FORMAT: 'Formato inválido',
  
  // Recursos
  NOT_FOUND: 'Recurso não encontrado',
  ALREADY_EXISTS: 'Recurso já existe',
  
  // Sistema
  INTERNAL_ERROR: 'Erro interno do servidor',
  DATABASE_ERROR: 'Erro na base de dados',
  EXTERNAL_SERVICE_ERROR: 'Erro em serviço externo'
} as const;