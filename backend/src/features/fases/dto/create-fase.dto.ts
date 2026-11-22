import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

/** GRUPOS se acepta como alias de GRUPO (el enum de BD es GRUPO). */
export const TIPOS_FASE_ENTRADA = ['GRUPO', 'GRUPOS', 'FINAL'] as const;

export class CreateFaseDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la fase es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede superar 100 caracteres' })
  nombre!: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsIn(TIPOS_FASE_ENTRADA, {
    message: 'tipo debe ser GRUPO (o GRUPOS) o FINAL',
  })
  tipo!: (typeof TIPOS_FASE_ENTRADA)[number];

  // Orden de ejecución dentro del torneo (1 = primera fase)
  @IsInt({ message: 'orden debe ser un entero' })
  @Min(1, { message: 'orden debe ser mayor o igual a 1' })
  @IsOptional()
  orden?: number;
}
