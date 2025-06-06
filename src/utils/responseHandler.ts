// utils/response-handler.ts
import { Response } from 'express';
import { ApiResponse } from 'types/response';
import env from "@lib/env"

export class ResponseHandler {
  // Resposta de sucesso
  static success<T>(
    res: Response,
    data?: T,
    message: string = 'Operação realizada com sucesso',
    statusCode: number = 200
  ): Response<ApiResponse<T>> {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId
      }
    };

    return res.status(statusCode).json(response);
  }

  // Resposta de erro
  static error(
    res: Response,
    message: string,
    errorCode: string,
    statusCode: number = 400,
    details?: unknown | Error
  ): Response<ApiResponse> {
    const response: ApiResponse = {
      success: false,
      message: 'Erro na operação',
      error: {
        code: errorCode,
        message,
        details: details instanceof Error ? ( env.ENABLE_RETURN_ERRORS ? details.stack : details.message ) : details ?? 'Erro desconhecido'
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId
      }
    };

    return res.status(statusCode).json(response);
  }

  // Resposta com paginação
  static paginated<T>(
    res: Response,
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
    },
    message: string = 'Dados recuperados com sucesso'
  ): Response<ApiResponse<T[]>> {
    const totalPages = Math.ceil(pagination.total / pagination.limit);

    const response: ApiResponse<T[]> = {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId,
        pagination: {
          ...pagination,
          totalPages
        }
      }
    };

    return res.status(200).json(response);
  }

  // Resposta de não autorizado
  static unauthorized(
    res: Response,
    message: string = 'Acesso não autorizado'
  ): Response<ApiResponse> {
    return this.error(res, message, 'UNAUTHORIZED', 401);
  }

  // Resposta de não encontrado
  static notFound(
    res: Response,
    resource: string = 'Recurso'
  ): Response<ApiResponse> {
    return this.error(
      res,
      `${resource} não encontrado`,
      'NOT_FOUND',
      404
    );
  }

  // Resposta de erro interno
  static internal(
    res: Response,
    message: string = 'Erro interno do servidor'
  ): Response<ApiResponse> {
    return this.error(res, message, 'INTERNAL_ERROR', 500);
  }
}