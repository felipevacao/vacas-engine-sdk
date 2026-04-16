export class BaseController<T> {
  constructor(model: any) { }
  public getModelTable(): string { return '' }
  public getModel(): any { return false }
  public getDefaultFields() { return false }
  public getSelectetAbleFields() { return false }
  public getExcludedFields() { return false }
  public async createEntity(data: any, options: any = {}): Promise<any> { return false }
  public async findAllEntity(options: any): Promise<any[]> { return [false] }
  public async findAllEntityPaginated(options: any): Promise<any> { return false }
  public async findByIdEntity(id: number | string, options: any = {}): Promise<any> { return false }
  public async findByEntity(options: any): Promise<any> { return false }
  public async findByEntityPaginated(options: any): Promise<any> { return false }
  public async updateEntity(id: number | string, data: any, options: any = {}): Promise<any> { return false }
  public async deleteEntity(id: number): Promise<boolean> { return false }
  public async forceDeleteEntity(id: number): Promise<boolean> { return false }
  public async count(options: any = {}): Promise<number> { return 0 }
  public getDefaultFilters(): any[] { return [] }
}
