import { Model } from "./model";

export interface BaseEntity {
    id?: number | string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export type HateoasLink = {
    rel: string;
    href: string;
    method: string;
};

export type HateoasEntity<T extends BaseEntity> = T & {
    _links: HateoasLink[];
};
  

// Layout de Entrada
export type CreateData<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt' |  'deletedAt'>;

// Layout de Update
export type UpdateData<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' >;

// Layout de Saída
export type OutputData<T extends BaseEntity> = Omit<T, "createdAt" | 'updatedAt' | 'deletedAt'>;

export type QueryFields<T extends BaseEntity> = { 
    links?: boolean,
    fields?: (keyof Model<T>)[],
    where?: Partial<T>,
    limit?: number,
    offset?: number,
    whereSign?: {
      field: string,
      sign: string,
      value: string
    }
}

export * from "./model";
// export * from './queryTypes';

export interface IAdapter<T, U> {
  create(input: T, output: U): Promise<void>;
  findAll(input: T, output: U): Promise<void>;
  findById(input: T, output: U): Promise<void>;
  findBy(input: T, output: U): Promise<void>;
}

export type LoginRequest = {
  email: string;
  password: string;
};
// Layout de Entrada - Create
export interface InputRequest<T> {
  body?: object | LoginRequest,
  params?: object,
  query: {
    fields?: string;
    where?: Partial<T>;
    links?: string;
  };
}