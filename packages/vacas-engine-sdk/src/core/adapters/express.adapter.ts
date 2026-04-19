import { BaseController } from "@core/controllers"
import { BaseEntity } from "@core/interfaces"
import { BaseServices } from "@core/services"

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