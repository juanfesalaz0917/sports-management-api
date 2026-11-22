import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateEscenarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del escenario es obligatorio' })
  @MaxLength(150, { message: 'El nombre no puede superar 150 caracteres' })
  nombre!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'La dirección no puede superar 255 caracteres' })
  direccion?: string;

  // Si se informa, el escenario es un espacio dentro de otro (complejo deportivo)
  @IsInt({ message: 'escenarioPadreId debe ser un entero' })
  @IsOptional()
  escenarioPadreId?: number;
}
