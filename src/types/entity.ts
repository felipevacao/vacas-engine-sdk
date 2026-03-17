import { Model } from "./model";
// Layout Base de Entidade
export interface BaseEntity {
  id?: number | string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
// layout de retorno HATEOAS
export type HateoasLink = {
  rel: string;
  href: string;
  method: string;
};

export type HateoasEntity<T extends BaseEntity> = T & {
  _links: HateoasLink[];
};


// Layout de Entrada
export type CreateData<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

// Layout de Update
export type UpdateData<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

// Layout de Saída
export type OutputData<T extends BaseEntity> = Omit<T, "createdAt" | 'updatedAt' | 'deletedAt'>;

// Layout de Query
export type QueryFields<T extends BaseEntity> = {
  originalUrl?: string;
  links?: boolean,
  fields?: (keyof Model<T>)[],
  where?: Partial<T>,
  limit?: number,
  offset?: number,
  orderBy?: string,
  order?: string,
  page?: number,
  pageSize?: number,
  // filter is used for specific conditions like 'greater than', 'less than', etc.
  // Example: filter: { field: 'age', sign: '>', value: '18' }
  filters?: QueryFilter[];
  paginated?: boolean;
}

export type QueryFilter = {
  field: string
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'BETWEEN'
  value: string | number | boolean | Date
}

export * from "./model";
export * from "./metadata";
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

export type PasswordResetRequest = {
  email?: string;
  newPassword?: string;
};

export type PasswordChangeRequest = {
  currentPassword: string;
  newPassword: string;
};

// Layout de Entrada - Create
export interface InputRequest<T> {
  originalUrl?: string;
  body?: object | LoginRequest,
  params?: object,
  query: {
    fields?: string;
    where?: Partial<T>;
    filter?: string | [] | undefined;
    orderBy?: string;
    order?: string;
    limit?: number;
    offset?: number;
    page?: number;
    pageSize?: number;
    links?: string;
    paginated?: string
  };
}

export interface Metadata {
  table: string;
  fields: {
    column_name: string;
    data_type: string;
    character_maximum_length?: number;
    formType?: string;
    label?: string;
    required?: boolean;
  }[];
  // relationships?: any[]; // Placeholder for future relationships
  // constraints?: any[]; // Placeholder for future constraints
}

export interface PaginatedResult<T extends BaseEntity> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextPageUrl?: string | null;
    prevPageUrl?: string | null;
  };
}

export type UserStatus = 'active' | 'inactive' | 'banned' | 'reset_required'

export type UserRole = 'admin' | 'manager' | 'regular' | 'guest'

export enum SessionType {
  ACTIVE = 'active',
  RESET = 'reset_required'
}

export enum UserStatusType {
  ACTIVE = 'active',
  RESET = 'reset_required',
  BANNED = 'banned',
  INACTIVE = 'inactive'
}

export type errorDetails = string[]

export type ErrorContext = {
  entity?: string,
  id?: number,
  details?: errorDetails,

}