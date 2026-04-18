import { ServerUnaryCall, sendUnaryData, status, Metadata as GrpcMetadata } from '@grpc/grpc-js';
import { BaseServices } from '@services';
import { CreateData, UpdateData } from '@app-types';
import { BaseEntity, EnhancedTableMetadata, ProtobufStruct, ProtobufValue } from '@interfaces';
import { BaseController } from '@controllers';

export abstract class BaseGrpcAdapter<T extends BaseEntity, C extends BaseController<T>> {
	constructor(protected service: BaseServices<T, C>) { }
	async create(call: ServerUnaryCall<ProtobufStruct, unknown>, callback: sendUnaryData<unknown>): Promise<void> { }
	async get(call: ServerUnaryCall<{ id: string }, unknown>, callback: sendUnaryData<unknown>): Promise<void> { }
	async update(call: ServerUnaryCall<ProtobufStruct & { id?: string }, unknown>, callback: sendUnaryData<unknown>): Promise<void> { }
	async delete(call: ServerUnaryCall<{ id: string }, unknown>, callback: sendUnaryData<unknown>): Promise<void> { }
	async list(call: ServerUnaryCall<{ page?: number; limit?: number; order_by?: string; order_direction?: string }, unknown>, callback: sendUnaryData<unknown>): Promise<void> { }
	async metadata(_call: ServerUnaryCall<unknown, unknown>, callback: sendUnaryData<unknown>): Promise<void> { }
}