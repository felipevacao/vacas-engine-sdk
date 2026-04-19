import { BaseEntity, IBaseServices } from "@interfaces";

/**
 * Factory para gerenciar e resolver instâncias de serviços dinamicamente.
 * Essencial para o carregamento de relações (Eager Loading) entre diferentes módulos.
 */
export class ServiceFactory {
    private static services: Record<string, () => IBaseServices<BaseEntity>> = {};

    /**
     * Registra um construtor de serviço associado a uma tabela.
     */
    public static register(
        table: string,
        serviceConstructor: () => IBaseServices<BaseEntity>
    ): void {
        this.services[table] = serviceConstructor;
    }

    /**
     * Resolve um serviço pelo nome da tabela.
     */
    public static get(table: string): IBaseServices<BaseEntity> | null {
        const constructor = this.services[table];
        return constructor ? constructor() : null;
    }
}
