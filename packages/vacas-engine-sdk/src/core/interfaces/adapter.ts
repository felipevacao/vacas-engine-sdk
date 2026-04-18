export interface IAdapter<T, U> {
	create(input: T, output: U): Promise<void>;
	findAll(input: T, output: U): Promise<void>;
	findById(input: T, output: U): Promise<void>;
	findBy(input: T, output: U): Promise<void>;
}