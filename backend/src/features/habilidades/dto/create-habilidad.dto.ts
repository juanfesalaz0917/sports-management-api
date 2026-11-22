import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateHabilidadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
