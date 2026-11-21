import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateAnotacionDto {
  @IsInt()
  jugadorId!: number;

  @IsInt()
  @Min(0)
  @Max(200)
  minuto!: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  tipo?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
