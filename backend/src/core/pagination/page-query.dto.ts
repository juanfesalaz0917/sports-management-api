import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * Parámetros de paginación acordados: ?page=&size= (page base 0).
 * Los DTOs de consulta de cada módulo extienden esta clase para agregar filtros.
 */
export class PageQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page debe ser un entero' })
  @Min(0, { message: 'page no puede ser negativo' })
  page: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'size debe ser un entero' })
  @Min(1, { message: 'size debe ser al menos 1' })
  @Max(100, { message: 'size no puede ser mayor a 100' })
  size: number = 10;
}
