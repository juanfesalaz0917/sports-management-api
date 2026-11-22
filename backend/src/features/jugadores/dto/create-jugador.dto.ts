import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateJugadorDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del jugador es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede superar 100 caracteres' })
  nombre!: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'El apellido no puede superar 100 caracteres' })
  apellido?: string;

  // Identificador único del jugador (documento)
  @IsString()
  @IsNotEmpty({ message: 'El documento del jugador es obligatorio' })
  @MaxLength(30, { message: 'El documento no puede superar 30 caracteres' })
  documento!: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'fechaNacimiento debe tener formato ISO válido (YYYY-MM-DD)' },
  )
  fechaNacimiento?: string;

  @IsInt({ message: 'posicionId debe ser un entero' })
  @IsOptional()
  posicionId?: number;
}
