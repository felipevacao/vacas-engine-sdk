import { BaseEntity, BaseView } from "@interfaces";
import { Knex } from 'knex';

// Layout de Entrada
export type CreateData<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

// Layout de Update
export type UpdateData<T extends BaseEntity> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>;

// Layout de Saída
export type OutputData<T extends BaseEntity | BaseView> = Omit<T, "createdAt" | 'updatedAt' | 'deletedAt' | "sourceOrigin" | "generatedAt" | "sourceVersion"> & { [key: string]: unknown };

export type KnexTable<T extends BaseEntity> = T & Knex.CompositeTableType<
  T,             // Select
  Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>, // Insert
  Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>> // Update
>;
