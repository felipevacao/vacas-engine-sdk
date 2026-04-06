import { ServerUnaryCall, sendUnaryData, status, Metadata as GrpcMetadata } from '@grpc/grpc-js';
import { BaseServices } from '../services/baseServices';
import { HttpStatus } from '../constants/HttpStatus';
import { BaseEntity, CreateData, EnhancedTableMetadata, UpdateData } from '@app-types/entity';
import { BaseController } from '@controllers/baseController';

/**
 * Interfaces para representar o google.protobuf.Struct de forma tipada
 */
interface ProtobufValue {
  kind?: 'stringValue' | 'numberValue' | 'boolValue' | 'structValue' | 'listValue' | 'nullValue';
  stringValue?: string;
  numberValue?: number;
  boolValue?: boolean;
  structValue?: ProtobufStruct;
  listValue?: { values: ProtobufValue[] };
  nullValue?: 0;
}

interface ProtobufStruct {
  fields: Record<string, ProtobufValue>;
}

export abstract class BaseGrpcAdapter<T extends BaseEntity, C extends BaseController<T>> {
  constructor(protected service: BaseServices<T, C>) { }

  /**
   * Converte Struct do Google para Objeto JS (Record<string, unknown>)
   */
  protected fromStruct(struct: ProtobufStruct): Record<string, unknown> {
    if (!struct || !struct.fields) return {};
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(struct.fields)) {
      if (value.kind === 'stringValue') result[key] = value.stringValue;
      else if (value.kind === 'numberValue') result[key] = value.numberValue;
      else if (value.kind === 'boolValue') result[key] = value.boolValue;
      else if (value.kind === 'structValue' && value.structValue) result[key] = this.fromStruct(value.structValue);
      else if (value.kind === 'listValue' && value.listValue) {
        result[key] = value.listValue.values.map(v => v.stringValue ?? v.numberValue ?? v.boolValue);
      }
    }
    return result;
  }

  /**
   * Converte Objeto JS para Struct do Google
   */
  protected toStruct(obj: unknown): ProtobufStruct {
    const fields: Record<string, ProtobufValue> = {};
    if (typeof obj !== 'object' || obj === null) return { fields };

    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (typeof value === 'string') fields[key] = { kind: 'stringValue', stringValue: value };
      else if (typeof value === 'number') fields[key] = { kind: 'numberValue', numberValue: value };
      else if (typeof value === 'boolean') fields[key] = { kind: 'boolValue', boolValue: value };
      else if (value instanceof Date) fields[key] = { kind: 'stringValue', stringValue: value.toISOString() };
      else if (Array.isArray(value)) {
        fields[key] = {
          kind: 'listValue',
          listValue: {
            values: value.map(v => ({ kind: typeof v === 'number' ? 'numberValue' : 'stringValue', [typeof v === 'number' ? 'numberValue' : 'stringValue']: String(v) }))
          }
        };
      }
      else if (typeof value === 'object' && value !== null) {
        fields[key] = { kind: 'structValue', structValue: this.toStruct(value) };
      }
    }
    return { fields };
  }

  async create(call: ServerUnaryCall<ProtobufStruct, unknown>, callback: sendUnaryData<unknown>): Promise<void> {
    try {
      const userId = call.metadata.get('x-user-id')[0] as string;
      if (userId) {
        // Aqui você pode injetar o userId no contexto do serviço se necessário
        // ex: this.service.context({ userId });
      }

      const data = this.fromStruct(call.request);
      const result = await this.service.createEntity(data as CreateData<T>);
      callback(null, {
        status: { code: HttpStatus.CREATED, message: 'Created', success: true },
        data: this.toStruct(result)
      });
    } catch (error: unknown) {
      this.handleError(error, callback);
    }
  }

  async get(call: ServerUnaryCall<{ id: string }, unknown>, callback: sendUnaryData<unknown>): Promise<void> {
    try {
      const result = await this.service.withId(call.request.id).setEntity();
      callback(null, {
        status: { code: HttpStatus.OK, message: 'Success', success: true },
        data: this.toStruct(result.getEntity())
      });
    } catch (error: unknown) {
      this.handleError(error, callback);
    }
  }

  async update(call: ServerUnaryCall<ProtobufStruct & { id?: string }, unknown>, callback: sendUnaryData<unknown>): Promise<void> {
    try {
      const data = this.fromStruct(call.request);
      const id = (data.id as string | number) || (call.request).id; // Fallback para ID no corpo ou request
      if (!id) throw new Error('ID is required for update');

      delete data.id;
      const result = await this.service.updateEntity(id, data as UpdateData<T>);
      callback(null, {
        status: { code: HttpStatus.OK, message: 'Updated', success: true },
        data: this.toStruct(result)
      });
    } catch (error: unknown) {
      this.handleError(error, callback);
    }
  }

  async delete(call: ServerUnaryCall<{ id: string }, unknown>, callback: sendUnaryData<unknown>): Promise<void> {
    try {
      await this.service.deleteEntity(parseInt(call.request.id));
      callback(null, {
        status: { code: HttpStatus.OK, message: 'Deleted', success: true }
      });
    } catch (error: unknown) {
      this.handleError(error, callback);
    }
  }

  async list(call: ServerUnaryCall<{ page?: number; limit?: number; order_by?: string; order_direction?: string }, unknown>, callback: sendUnaryData<unknown>): Promise<void> {
    try {
      const options = {
        page: call.request.page || 1,
        limit: call.request.limit || 10,
        orderBy: call.request.order_by,
        orderDirection: (call.request.order_direction as 'ASC' | 'DESC') || 'ASC'
      };
      const result = await this.service.findAllEntityPaginated(options);
      callback(null, {
        status: { code: HttpStatus.OK, message: 'Success', success: true },
        data: result.data.map(item => this.toStruct(item)),
        total: result.pagination.total,
        page: result.pagination.page
      });
    } catch (error: unknown) {
      this.handleError(error, callback);
    }
  }

  async metadata(_call: ServerUnaryCall<unknown, unknown>, callback: sendUnaryData<unknown>): Promise<void> {
    try {
      const result: EnhancedTableMetadata = await this.service.getMetadata();
      callback(null, {
        status: { code: HttpStatus.OK, message: 'Success', success: true },
        metadata: {
          table_name: result.table,
          fields: result.fields,
          // structure: this.toStruct(result.structure)
        }
      });
    } catch (error: unknown) {
      this.handleError(error, callback);
    }
  }

  private handleError(error: unknown, callback: sendUnaryData<unknown>): void {
    const message = error instanceof Error ? error.message : 'Unknown error';
    callback({
      code: status.INTERNAL,
      message: message,
      metadata: new GrpcMetadata()
    });
  }
}
