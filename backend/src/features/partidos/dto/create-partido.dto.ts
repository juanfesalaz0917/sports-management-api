import { Transform } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePartidoDto {
  @Transform(({ obj, value }) => value ?? obj.fecha_hora)
  @IsDateString({}, { message: 'fechaHora debe tener formato ISO válido' })
  fechaHora!: string;

  @Transform(({ obj, value }) => (value !== undefined ? Number(value) : obj.id_torneo !== undefined ? Number(obj.id_torneo) : undefined))
  @IsInt()
  torneoId!: number;

  @Transform(({ obj, value }) => (value !== undefined ? Number(value) : obj.id_fase !== undefined ? Number(obj.id_fase) : undefined))
  @IsInt()
  @IsOptional()
  faseId?: number;

  @Transform(({ obj, value }) => (value !== undefined ? Number(value) : obj.id_escenario !== undefined ? Number(obj.id_escenario) : undefined))
  @IsInt()
  escenarioId!: number;

  @Transform(({ obj, value }) => (value !== undefined ? Number(value) : obj.id_equipo_local !== undefined ? Number(obj.id_equipo_local) : undefined))
  @IsInt()
  equipoLocalId!: number;

  @Transform(({ obj, value }) => (value !== undefined ? Number(value) : obj.id_equipo_visitante !== undefined ? Number(obj.id_equipo_visitante) : undefined))
  @IsInt()
  equipoVisitanteId!: number;

  @Transform(({ obj, value }) => (value !== undefined ? Number(value) : obj.id_pelota !== undefined ? Number(obj.id_pelota) : undefined))
  @IsInt()
  @IsOptional()
  pelotaId?: number;

  @IsString()
  @IsOptional()
  estado?: string;
}
