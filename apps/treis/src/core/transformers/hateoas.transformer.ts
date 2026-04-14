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
                let links: HateoasLink[] = [];
                try {
                    const result = typeof itemLinks === 'function' ? itemLinks(entity) : [];
                    links = Array.isArray(result) ? result : [];
                } catch (e) {
                    console.error('Erro ao gerar links para item:', e);
                    links = [];
                }
                return {
                    ...entity,
                    _links: links
                };
            });
        }
        return entities
    }
}