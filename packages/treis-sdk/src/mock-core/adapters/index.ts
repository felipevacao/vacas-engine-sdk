import { ServerUnaryCall, sendUnaryData, status, Metadata as GrpcMetadata } from '@grpc/grpc-js';
import { BaseServices } from '../services';
import { BaseEntity, ProtobufStruct } from '../interfaces';
import { BaseController } from '../controllers';

export abstract class BaseGrpcAdapter<T extends BaseEntity, C extends BaseController<T>> {
	constructor(protected service: BaseServices<T, C>) { }
	async create(call: ServerUnaryCall<ProtobufStruct, unknown>, callback: sendUnaryData<unknown>): Promise<void> { }
	async get(call: ServerUnaryCall<{ id: string }, unknown>, callback: sendUnaryData<unknown>): Promise<void> { }
	async update(call: ServerUnaryCall<ProtobufStruct & { id?: string }, unknown>, callback: sendUnaryData<unknown>): Promise<void> { }
	async delete(call: ServerUnaryCall<{ id: string }, unknown>, callback: sendUnaryData<unknown>): Promise<void> { }
	async list(call: ServerUnaryCall<{ page?: number; limit?: number; order_by?: string; order_direction?: string }, unknown>, callback: sendUnaryData<unknown>): Promise<void> { }
	async metadata(_call: ServerUnaryCall<unknown, unknown>, callback: sendUnaryData<unknown>): Promise<void> { }
}
export class ExpressAdapter<T extends BaseEntity, C extends BaseController<T>> {
	constructor(service: BaseServices<T, BaseController<T>>) { }
	create(req: any, res: any): Promise<void> { return Promise.resolve() };
	forceDelete(req: any, res: any): Promise<void> { return Promise.resolve() };
	delete(req: any, res: any): Promise<void> { return Promise.resolve() };
	update(req: any, res: any): Promise<void> { return Promise.resolve() };
	findById(req: any, res: any): Promise<void> { return Promise.resolve() };
	findAll(req: any, res: any): Promise<void> { return Promise.resolve() };
	findBy(req: any, res: any): Promise<void> { return Promise.resolve() };
	metadata(req: any, res: any): Promise<void> { return Promise.resolve() };
	bulkCreate(req: any, res: any): Promise<void> { return Promise.resolve() };
	bulkUpdate(req: any, res: any): Promise<void> { return Promise.resolve() };
	bulkDelete(req: any, res: any): Promise<void> { return Promise.resolve() };
}
