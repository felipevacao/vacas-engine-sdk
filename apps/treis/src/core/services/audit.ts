import { AuditPayload } from "@interfaces";
import { db } from "@utils";

export class AuditService {
    static async log(payload: AuditPayload): Promise<void> {
        try {
            await db('vacas_audit_logs').insert({
                table_name: payload.tableName,
                entity_id: String(payload.entityId),
                action: payload.action,
                old_data: payload.oldData ? JSON.stringify(payload.oldData) : null,
                new_data: payload.newData ? JSON.stringify(payload.newData) : null,
                user_id: payload.userId,
                ip_address: payload.ipAddress
            });
        } catch (error) {
            // Falha silenciosa na auditoria para não travar a operação principal,
            // mas em produção deveríamos logar este erro em algum lugar (ex: Sentry)
            console.error('Audit Log Error:', error);
        }
    }
}
