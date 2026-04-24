/**
 * Utilitário para consumir metadados HATEOAS fornecidos pela API.
 */

export interface HateoasLink {
  rel: string;
  href: string;
  method: string;
}

export interface HateoasEntity {
  _links?: HateoasLink[];
}

/**
 * Extrai a URL de um link HATEOAS baseado na relação (rel) desejada.
 * 
 * @param entity A entidade retornada pela API que contém o bloco _links
 * @param rel A relação desejada (ex: 'self', 'update', 'delete')
 * @returns A URL (href) correspondente ou null se não encontrar
 */
export const getLink = (entity: HateoasEntity, rel: string): string | null => {
  const link = entity._links?.find((l) => l.rel === rel);
  return link ? link.href : null;
};

/**
 * Extrai o método HTTP de um link HATEOAS.
 */
export const getMethod = (entity: HateoasEntity, rel: string): string | null => {
  const link = entity._links?.find((l) => l.rel === rel);
  return link ? link.method : null;
};
