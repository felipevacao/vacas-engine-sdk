import { BaseEntity } from "@interfaces";

// layout de retorno HATEOAS
export type HateoasLink = {
	rel: string;
	href: string;
	method: string;
};

export type HateoasEntity<T extends BaseEntity> = T & {
	_links: HateoasLink[];
};