import { IsInt, IsOptional, Max, Min } from 'class-validator';

/** Cuerpo de POST /habilidades-jugador. Acepta camelCase (front) y snake_case (legado). */
export class AsignarHabilidadJugadorDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  jugadorId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  habilidadId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  id_jugador?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  id_habilidad?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  nivel?: number;
}

export class CreateHabilidadJugadorDto {
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  nivel?: number;
}
