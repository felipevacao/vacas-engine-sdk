import { Request, Response } from 'express';
import { BaseEntity, Model } from '../types/entity';

export class BaseController<T extends BaseEntity> {
    constructor(private model: Model<T>) {}

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
            const result = await this.model.create(data);
            result.links = this.generateHateoasLinks(this.model, result.id);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error creating entity', error });
        }
    }

    public async findAll(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.model.findAll();
            const aResult = result.map(entity => {
                entity.links = this.generateHateoasLinks(this.model, entity.id);
                return entity
            });
            res.status(200).json(aResult);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching entities', error });
        }
    }

    public async findById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const result = await this.model.findById(id);
            if (!result) {
                res.status(404).json({ message: 'Entity not found' });
            } else {
                result.links = this.generateHateoasLinks(this.model, result.id);
                res.status(200).json(result);
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching entity', error });
        }
    }

    public async findBy(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query as Partial<T>;
            const result = await this.model.findBy(query);
            if (!result) {
                res.status(404).json({ message: 'Entity not found' });
            } else {
                const aResult = result.map(entity => {
                    entity.links = this.generateHateoasLinks(this.model, entity.id);
                    return entity
                });
                res.status(200).json(aResult);
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching entity', error });
        }
    }
}