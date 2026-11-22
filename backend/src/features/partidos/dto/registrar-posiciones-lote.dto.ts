import { IsArray, IsOptional } from 'class-validator';

export interface PosicionElementoDto {
  jugadorId?: number;
  esPelota?: boolean;
  x: number;
  y: number;
  timestamp?: string;
}

export class RegistrarPosicionesLoteDto {
  @IsArray()
  @IsOptional()
  posiciones!: PosicionElementoDto[];
}
