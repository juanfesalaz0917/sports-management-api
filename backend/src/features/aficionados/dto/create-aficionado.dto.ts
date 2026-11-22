import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAficionadoDto {
  @IsInt()
  @IsNotEmpty({ message: 'El usuarioId es obligatorio' })
  usuarioId!: number;

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  apellido?: string;

  @IsString()
  @IsOptional()
  telefono?: string;
}
