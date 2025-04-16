import env from "../lib/env"
import { Request, Response } from 'express';
import { BaseEntity, Model, UpdateData } from '../types/entity';
import { HateoasTransformer } from '../transformers/hateoas.transformer';

export class BaseController<T extends BaseEntity> {
    constructor(private model: Model<T>) {}
    
    public generateQueryFields(req: Request) {

        const extraFields = req.query.fields ? (req.query.fields as string).split(',') as (keyof Model<T>)[] : [];
        
        const fields = this.getAvailableFields(this.model, extraFields) as (keyof T)[];

        const where = req.query.where as Partial<T> ?? [];

        const links = req.query.links ? ( req.query.links == 'true' ? true : false ) : env.ENABLE_HATEOAS;

        return {
            fields,
            where,
            links
            };
    }

    public getAvailableFields(model: Model<T>, extraFields: (keyof Model<T>)[] = []): (keyof Model<T>)[] {
        return ([
          ...model.defaultFields,
          ...model.selectableFields,
          ...extraFields
        ] as (keyof Model<T>)[]).filter((field) => !model.excludedFields.includes(field as keyof T));
    }

    public generateHateoasLinks(model: Model<T>, id: number | undefined): { rel: string; href: string; method: string }[] {
        return [
          { rel: "self", href: `/${model.table}/${id}`, method: "GET" },
          { rel: "update", href: `/${model.table}/${id}`, method: "PUT" },
          { rel: "delete", href: `/${model.table}/${id}`, method: "DELETE" },
        ];
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            const options = this.generateQueryFields(req);
            const result = await this.model.create(data, options);
            const response = HateoasTransformer.addLinks(result, this.generateHateoasLinks(this.model, result.id), options.links);
            res.status(201).json(response);
        } catch (error) {
            res.status(500).json({ message: 'Error creating entity', error });
        }
    }

    public async findAll(req: Request, res: Response): Promise<void> {
        try {
            const options = this.generateQueryFields(req);
            const result = await this.model.findAll(options);
            const response = HateoasTransformer.addCollectionLinks(result, (item) => this.generateHateoasLinks(this.model, item.id), options.links);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching entities', error });
        }
    }    
    
    public async findById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const options = this.generateQueryFields(req);
            const result = await this.model.findById(id, options);
            if (!result) {
                res.status(404).json({ message: 'Entity not found' });
            } else {
                const response = HateoasTransformer.addLinks(result, this.generateHateoasLinks(this.model, result.id), options.links);
                res.status(200).json(response);
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching entity', error });
        }
    }

    public async findBy(req: Request, res: Response): Promise<void> {
        try {
            const options = this.generateQueryFields(req);
            const result = await this.model.findBy(options);
            if (!result) {
                res.status(404).json({ message: 'Entity not found' });
            } else {
                const response = HateoasTransformer.addCollectionLinks(result, (item) => this.generateHateoasLinks(this.model, item.id), options.links);
                res.status(200).json(response);
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching entity', error });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const data = req.body as UpdateData<T>;
            
            const numericId = Number(id);
            
            if (isNaN(numericId)) {
                res.status(400).json({ message: 'Invalid ID format' });
                return;
            }
            const options = this.generateQueryFields(req);
            const result = await this.model.update(numericId, data, options);
            const response = HateoasTransformer.addLinks(result, this.generateHateoasLinks(this.model, result.id), options.links);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: 'Error updating entity', error });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const numericId = Number(id);

            if (isNaN(numericId)) {
                res.status(400).json({ message: 'Invalid ID format' });
                return;
            }

            const success = await this.model.delete(numericId);

            if (!success) {
                res.status(404).json({ message: 'Entity not found' });
                return;
            }

            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting entity', error });
        }
    }

    public async forceDelete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const numericId = Number(id);

            if (isNaN(numericId)) {
                res.status(400).json({ message: 'Invalid ID format' });
                return;
            }

            const success = await this.model.forceDelete(numericId);

            if (!success) {
                res.status(404).json({ message: 'Entity not found' });
                return;
            }

            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting entity', error });
        }
    }
}