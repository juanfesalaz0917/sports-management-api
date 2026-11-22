import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export const GENEROS_EQUIPO = ['MASCULINO', 'FEMENINO', 'MIXTO'] as const;

export class CreateEquipoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del equipo es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede superar 100 caracteres' })
  nombre!: string;

  @IsOptional()
  @IsIn(GENEROS_EQUIPO, {
    message: 'genero debe ser MASCULINO, FEMENINO o MIXTO',
  })
  genero?: 'MASCULINO' | 'FEMENINO' | 'MIXTO';

  @IsOptional()
  @IsDateString(
    {},
    { message: 'fechaCreacion debe tener formato ISO válido (YYYY-MM-DD)' },
  )
  fechaCreacion?: string;
}
