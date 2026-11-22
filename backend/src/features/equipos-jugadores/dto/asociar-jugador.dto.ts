import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class AsociarJugadorDto {
  @IsInt({ message: 'jugadorId debe ser un entero' })
  jugadorId!: number;

  // Por defecto, hoy
  @IsOptional()
  @IsDateString(
    {},
    { message: 'fechaInicio debe tener formato ISO válido (YYYY-MM-DD)' },
  )
  fechaInicio?: string;

  // Nula = vínculo vigente sin fecha de término
  @IsOptional()
  @IsDateString(
    {},
    { message: 'fechaFin debe tener formato ISO válido (YYYY-MM-DD)' },
  )
  fechaFin?: string;
}
