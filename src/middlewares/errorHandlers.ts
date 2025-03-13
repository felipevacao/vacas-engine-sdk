// api/src/utils/errorHandlers.ts
import { Request, Response } from 'express';

// Função para retornar erro 404
export const notFound = (res: Response, message: string = 'Rota não encontrada.') => {
  return res.status(404).json({ error: message });
};

export const routeNotFound = (req: Request, res: Response) => {
  notFound(res, 'Rota não encontrada.');
};

export const errorHandler = (err: Error, req: Request, res: Response) => {
  console.error('Erro:', err.message);
  res.status(500).json({ error: 'Algo deu errado.' });
};
