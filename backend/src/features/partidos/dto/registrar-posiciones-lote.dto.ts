import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';

export class PosicionElementoDto {
  @IsOptional()
  @IsInt()
  jugadorId?: number;

  @IsOptional()
  @IsBoolean()
  esPelota?: boolean;

  @IsNumber({}, { message: 'x debe ser un número normalizado' })
  @Min(0)
  @Max(1)
  x!: number;

  @IsNumber({}, { message: 'y debe ser un número normalizado' })
  @Min(0)
  @Max(1)
  y!: number;

  @IsOptional()
  @IsString()
  timestamp?: string;
}

export class RegistrarPosicionesLoteDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PosicionElementoDto)
  posiciones!: PosicionElementoDto[];
}
