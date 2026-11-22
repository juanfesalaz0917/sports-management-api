import { PageQueryDto } from './page-query.dto';

/** Respuesta paginada acordada: { content, totalElements } (+ page y size). */
export class PageResponseDto<T> {
  content!: T[];
  totalElements!: number;
  page!: number;
  size!: number;
}

export function toPage<T>(
  content: T[],
  totalElements: number,
  query: PageQueryDto,
): PageResponseDto<T> {
  return { content, totalElements, page: query.page, size: query.size };
}
