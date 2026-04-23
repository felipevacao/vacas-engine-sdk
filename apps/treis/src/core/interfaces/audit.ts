export interface AuditPayload {
	tableName: string;
	entityId: string | number;
	action: 'INSERT' | 'UPDATE' | 'DELETE' | 'RESTORE';
	oldData?: any;
	newData?: any;
	userId?: number;
	ipAddress?: string;
}