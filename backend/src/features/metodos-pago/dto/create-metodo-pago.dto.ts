import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMetodoPagoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
