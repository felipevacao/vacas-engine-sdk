import { BaseController } from "../controllers/baseController";
import { BaseEntity, CreateData, IAdapter, InputRequest, QueryFields, Model, UpdateData} from "../types/entity";

export abstract class BaseAdapter<T, U> implements IAdapter<T, U> {
    constructor(protected service: BaseController<BaseEntity>) {
        this.service = service;
    }

    abstract create(input: T, output: U): Promise<void>;

    abstract findAll(input: T, output: U): Promise<void>;

    abstract findById(input: T, output: U): Promise<void>;

    abstract findBy(input: T, output: U): Promise<void>;

    abstract update(input: T, output: U): Promise<void>;

    abstract delete(input: T, output: U): Promise<void>;

    abstract forceDelete(input: T, output: U): Promise<void>;

    protected async validateCreate(input: InputRequest<T>): Promise<CreateData<BaseEntity>> {
        return await this.service.generateBodyCreate(input) ?? input.body as CreateData<BaseEntity>;
    }

    protected async validateUpdate(input: InputRequest<T>): Promise<UpdateData<BaseEntity>> {
        return await this.service.generateBodyUpdate(input) ?? input.body as UpdateData<BaseEntity>;
    }

    protected generateQueryFields(input: InputRequest<T>): QueryFields<BaseEntity> {

        const extraFields = input.query.fields ? (input.query.fields as string).split(',') as (keyof Model<BaseEntity>)[] : [];
        const fields = this.service.getAvailableFields(extraFields) as (keyof Model<BaseEntity>)[];
        const where = input.query.where as Partial<T> ?? [];

        return {
            links: input.query.links ? ( input.query.links == 'true' ? true : false ) : this.service.hateoas,
            fields,
            where,
            }
    }
}