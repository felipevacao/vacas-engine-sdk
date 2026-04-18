export interface BaseEntity {
	id?: number | string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date | null;
}