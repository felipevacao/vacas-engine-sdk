import { Request, Response } from 'express';
import { BaseAdapter } from './base.adapter';
import { BaseEntity, CreateData } from 'types/entity';
import { BaseController } from '@controllers/baseController';
import { HateoasTransformer } from '@transformers/hateoas.transformer';

export class ExpressAdapter<T extends BaseEntity> extends BaseAdapter<T, Request, Response> {
    constructor(protected service: BaseController<T>){
        super(service)
    }    
    
    protected generateHateoasLinks(table: string, id: number | undefined): { rel: string; href: string; method: string }[] {
        return [
            { rel: "self", href: `/${table}/${id}`, method: "GET" },
            { rel: "update", href: `/${table}/${id}`, method: "PUT" },
            { rel: "delete", href: `/${table}/${id}`, method: "DELETE" },
        ];
    }

    async validateCreate(req: Request): Promise<CreateData<T>> {
        const body = req.body as CreateData<T>;
        return body;
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.validateCreate(req);
            const options = this.generateQueryFields(req);
            const result = await this.service.createEntity(data, options);
            const response = HateoasTransformer.addLinks(result, this.generateHateoasLinks(this.service.getModelTable(), result.id), options.links);
            res.status(201).json(response);
        } catch (error) {
            res.status(500).json({ message: 'Error creating entity', error });
        }
    }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const options = this.generateQueryFields(req);
            const result = await this.service.findAllEntity(options);
            const response = HateoasTransformer.addCollectionLinks(result, (item) => this.generateHateoasLinks(this.service.getModelTable(), item.id), options.links);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching entities', error });
        }
    }  

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const options = this.generateQueryFields(req);
            const result = await this.service.findByIdEntity(id, options);
            if (!result) {
                res.status(404).json({ message: 'Entity not found' });
            } else {
                const response = HateoasTransformer.addLinks(result, this.generateHateoasLinks(this.service.getModelTable(), result.id), options.links);
                res.status(200).json(response);
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching entity', error });
        }
    }

    async findBy(req: Request, res: Response): Promise<void> {
        try {
            const options = this.generateQueryFields(req);
            const result = await this.service.findByEntity(options);
            if (result.length === 0) {
                res.status(404).json({ message: 'Entity not found' });
            } else {
                const response = HateoasTransformer.addCollectionLinks(result, (item) => this.generateHateoasLinks(this.service.getModelTable(), item.id), options.links || false)
                res.status(200).json(response);
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching entity', error });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const data = await this.validateUpdate(req);
            
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID format' });
                return;
            }
            const options = this.generateQueryFields(req);
            const result = await this.service.updateEntity(id, data, options);
            const response = HateoasTransformer.addLinks(result, this.generateHateoasLinks(this.service.getModelTable(), result.id), options.links)
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: 'Error updating entity', error });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID format' });
                return;
            }

            const success = await this.service.deleteEntity(id);

            if (!success) {
                res.status(404).json({ message: 'Entity not found' });
                return;
            }

            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting entity', error });
        }
    }

    async forceDelete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const numericId = Number(id);

            if (isNaN(numericId)) {
                res.status(400).json({ message: 'Invalid ID format' });
                return;
            }

            const success = await this.service.forceDeleteEntity(numericId);

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