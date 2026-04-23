import { TableMetadata } from "./metadata";

export interface FormState {
	metadata: TableMetadata;
	data: unknown;
	loading: boolean;
	error: string | null;
}