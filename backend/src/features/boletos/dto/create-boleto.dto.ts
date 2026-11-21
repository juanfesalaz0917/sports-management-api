import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateBoletoDto {
  @IsString()
  @IsNotEmpty({ message: 'El código del boleto es obligatorio' })
  codigo!: string;

  @IsNumber()
  @Min(0)
  precio!: number;

  @IsInt()
  partidoId!: number;

  @IsInt()
  localidadId!: number;

  @IsInt()
  @IsOptional()
  aficionadoId?: number;

  @IsString()
  @IsOptional()
  estado?: string;
}
