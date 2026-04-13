import { HateoasEntity, HateoasLink, BaseEntity } from '@app-types/entity';

/**
 * Classe utilitária para transformar entidades em formato HATEOAS, adicionando links de navegação conforme necessário.
 * Permite configurar se os links devem ser incluídos ou não, facilitando a adaptação da resposta conforme o contexto da aplicação.
 */
export class HateoasTransformer {
    static addLinks<T extends BaseEntity>(
        entity: T,
        links: HateoasLink[],
        showLinks: boolean = false
    ): HateoasEntity<T> | T {
        if (showLinks) {
            return {
                ...entity,
                _links: links
            };
        }
        return entity;
    }

    static addCollectionLinks<T extends BaseEntity>(
        entities: T[],
        itemLinks: (item: T) => HateoasLink[],
        showLinks: boolean = false
    ): HateoasEntity<T>[] | T[] {
        if (showLinks) {
            return entities.map(entity => {
                const links = typeof itemLinks === 'function' ? itemLinks(entity) : [];
                return {
                    ...entity,
                    _links: Array.isArray(links) ? [...links] : []
                };
            });
        }
        return entities
    }
}