import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDeporteDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del deporte es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede superar 100 caracteres' })
  nombre!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  // Si se informa, el deporte se crea como subdeporte de ese deporte
  @IsInt({ message: 'deportePadreId debe ser un entero' })
  @IsOptional()
  deportePadreId?: number;
}
