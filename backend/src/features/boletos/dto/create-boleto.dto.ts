import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateBoletoDto {
  @IsString()
  @IsNotEmpty({ message: 'El código del boleto es obligatorio' })
  codigo!: string;

  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @Min(0)
  precio!: number;

  @Transform(({ obj, value }) => (value !== undefined ? Number(value) : obj.id_partido !== undefined ? Number(obj.id_partido) : undefined))
  @IsInt()
  partidoId!: number;

  @Transform(({ obj, value }) => (value !== undefined ? Number(value) : obj.id_localidad !== undefined ? Number(obj.id_localidad) : undefined))
  @IsInt()
  localidadId!: number;

  @Transform(({ obj, value }) => (value !== undefined ? Number(value) : obj.id_aficionado !== undefined ? Number(obj.id_aficionado) : undefined))
  @IsInt()
  @IsOptional()
  aficionadoId?: number;

  @IsString()
  @IsOptional()
  estado?: string;
}
