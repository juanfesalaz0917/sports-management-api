import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePartidoDto {
  @IsDateString({}, { message: 'fechaHora debe tener formato ISO válido' })
  fechaHora!: string;

  @IsInt()
  torneoId!: number;

  @IsInt()
  @IsOptional()
  faseId?: number;

  @IsInt()
  escenarioId!: number;

  @IsInt()
  equipoLocalId!: number;

  @IsInt()
  equipoVisitanteId!: number;

  @IsInt()
  @IsOptional()
  pelotaId?: number;

  @IsString()
  @IsOptional()
  estado?: string;
}
