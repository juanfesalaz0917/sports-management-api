import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTorneoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del torneo es obligatorio' })
  @MaxLength(150, { message: 'El nombre no puede superar 150 caracteres' })
  nombre!: string;

  @IsDateString(
    {},
    { message: 'fechaInicio debe tener formato ISO válido (YYYY-MM-DD)' },
  )
  fechaInicio!: string;

  @IsDateString(
    {},
    { message: 'fechaFin debe tener formato ISO válido (YYYY-MM-DD)' },
  )
  fechaFin!: string;

  // Último día para inscribir equipos; debe ser anterior o igual a fechaInicio
  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'fechaCierreInscripciones debe tener formato ISO válido (YYYY-MM-DD)',
    },
  )
  fechaCierreInscripciones?: string;

  @IsInt({ message: 'deporteId debe ser un entero' })
  deporteId!: number;
}
