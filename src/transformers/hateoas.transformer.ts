import { HateoasEntity, HateoasLink, BaseEntity } from '../types/entity';

export class HateoasTransformer {
    static addLinks<T extends BaseEntity>(
        entity: T,
        links: HateoasLink[],
        showLinks: boolean
    ): HateoasEntity<T> | T {
        if(showLinks){
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
        showLinks: boolean
    ): HateoasEntity<T>[] | T[] {
        if(showLinks){
            return entities.map(entity => ({
                ...entity,
                _links: itemLinks ? [...itemLinks(entity)] : []
            }));
        }
        return entities
    }
}