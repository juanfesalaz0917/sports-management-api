import { Transform } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateApuestaDto {
  @Transform(({ obj, value }) => (value !== undefined ? Number(value) : obj.id_aficionado !== undefined ? Number(obj.id_aficionado) : undefined))
  @IsInt()
  aficionadoId!: number;

  @Transform(({ obj, value }) => (value !== undefined ? Number(value) : obj.id_partido !== undefined ? Number(obj.id_partido) : undefined))
  @IsInt()
  partidoId!: number;

  @Transform(({ obj, value }) => (value !== undefined ? Number(value) : obj.id_metodo_aficionado !== undefined ? Number(obj.id_metodo_aficionado) : undefined))
  @IsInt()
  metodoAficionadoId!: number;

  @Transform(({ obj, value }) => {
    const raw = value ?? obj.id_equipo ?? obj.id_equipo_seleccionado;
    return raw !== undefined ? Number(raw) : undefined;
  })
  @IsInt()
  equipoId!: number;

  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @Min(1.0, { message: 'El monto mínimo de apuesta es 1.0' })
  monto!: number;

  @IsString()
  @IsOptional()
  estado?: string;
}
