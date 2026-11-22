import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePosicionEspacialDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la posición espacial es obligatorio' })
  nombre!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
