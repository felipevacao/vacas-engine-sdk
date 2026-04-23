import { Request, Response } from 'express';
import { ReportController } from '@controllers';
import { ResponseHandler, asyncHandler } from '@utils';
import { MESSAGES } from '@constants';
import { BaseAdapter } from './base.adapter';
import { BaseEntity } from '@interfaces';
import { BaseServices } from '@services';
import { GenericModel, GenericController } from '@utils';


export class ReportExpressAdapter<T extends BaseEntity> extends BaseAdapter<BaseEntity, Request, Response> {
  private controller = new ReportController();
  constructor() {
    const base = new BaseServices(new GenericController());
    super(base)
  }

  handle = asyncHandler(async (req: Request, res: Response) => {

    const reportId = req.params.reportId as string;
    const options = this.generateQueryFields(req)

    const data = await this.controller.execute(reportId as string, options);
    ResponseHandler.success(res, data, MESSAGES.API.SUCCESS_DATA);

  });

  async create(req: Request, res: Response): Promise<void> { }
  async findAll(req: Request, res: Response): Promise<void> { }
  async findById(req: Request, res: Response): Promise<void> { }
  async findBy(req: Request, res: Response): Promise<void> { }
  async update(req: Request, res: Response): Promise<void> { }
  async delete(req: Request, res: Response): Promise<void> { }
  async forceDelete(req: Request, res: Response): Promise<void> { }
  async metadata(req: Request, res: Response): Promise<void> { }
}
