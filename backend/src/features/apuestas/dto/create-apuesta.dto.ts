import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateApuestaDto {
  @IsInt()
  aficionadoId!: number;

  @IsInt()
  partidoId!: number;

  @IsInt()
  metodoAficionadoId!: number;

  @IsNumber()
  @Min(1.0, { message: 'El monto mínimo de apuesta es 1.0' })
  monto!: number;

  @IsString()
  @IsOptional()
  estado?: string;
}
