import { Request, Response } from 'express';
import { BaseEntity, Model } from '../types/entity';

export class BaseController<T extends BaseEntity> {
    constructor(private model: Model<T>) {}

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            const result = await this.model.create(data);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error creating entity', error });
        }
    }

    public async findAll(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.model.findAll();
            res.status(200).json(result);
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
                res.status(200).json(result);
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching entity', error });
        }
    }
}