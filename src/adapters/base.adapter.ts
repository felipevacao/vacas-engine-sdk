import { BaseController } from "@controllers/baseController";
import { BaseEntity, CreateData, IAdapter, InputRequest, QueryFields, Model, UpdateData} from "types/entity";

export abstract class BaseAdapter<T extends BaseEntity, V, U> implements IAdapter<V, U> {
    constructor(protected service: BaseController<T>) {
        this.service = service;
    }

    abstract create(input: V, output: U): Promise<void>;

    abstract findAll(input: V, output: U): Promise<void>;

    abstract findById(input: V, output: U): Promise<void>;

    abstract findBy(input: V, output: U): Promise<void>;

    abstract update(input: V, output: U): Promise<void>;

    abstract delete(input: V, output: U): Promise<void>;

    abstract forceDelete(input: V, output: U): Promise<void>;

    protected async validateCreate(input: InputRequest<V>): Promise<CreateData<T>> {
        return await this.service.generateBodyCreate(input) ?? input.body as CreateData<T>;
    }

    protected async validateUpdate(input: InputRequest<V>): Promise<UpdateData<T>> {
        return await this.service.generateBodyUpdate(input) ?? input.body as UpdateData<T>;
    }

    protected generateQueryFields(input: InputRequest<V>): QueryFields<T> {
        const extraFields = input.query.fields ? (input.query.fields as string).split(',') as (keyof Model<T>)[] : [];
        const fields = this.service.getAvailableFields(extraFields) as (keyof Model<T>)[];
        const where = input.query.where as Partial<T> ?? [];

        return {
            links: input.query.links ? ( input.query.links == 'true' ? true : false ) : this.service.hateoas,
            fields,
            where,
            }
    }
}