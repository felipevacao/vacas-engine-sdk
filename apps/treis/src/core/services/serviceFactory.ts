import { BaseEntity } from "@app-types/entity";
import { BaseServices } from "./baseServices";
import { BaseController } from "@controllers/baseController";

/**
 * Factory para gerenciar e resolver instâncias de serviços dinamicamente.
 * Essencial para o carregamento de relações (Eager Loading) entre diferentes módulos.
 */
export class ServiceFactory {
    private static services: Record<string, () => BaseServices<any, BaseController<any>>> = {};

    /**
     * Registra um construtor de serviço associado a uma tabela.
     */
    public static register(table: string, serviceConstructor: () => BaseServices<any, BaseController<any>>) {
        this.services[table] = serviceConstructor;
    }

    /**
     * Resolve um serviço pelo nome da tabela.
     */
    public static get(table: string): BaseServices<any, BaseController<any>> | null {
        const constructor = this.services[table];
        return constructor ? constructor() : null;
    }
}
