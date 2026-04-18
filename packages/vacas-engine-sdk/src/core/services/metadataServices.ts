import { EnhancedTableMetadata } from "@interfaces";

/**
 * SDK MetadataService Skeleton.
 */
export class MetadataService {
    constructor(private tableName: string) { }

    async getTableMetadata(): Promise<EnhancedTableMetadata> {
        throw new Error("SDK Skeleton: Real implementation in Treis Engine.");
    }
}
