import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMetodoPagoAficionadoDto {
  @IsInt()
  metodoPagoId!: number;

  @IsString()
  @IsOptional()
  referencia?: string;
}
