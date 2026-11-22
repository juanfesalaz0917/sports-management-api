import { IsDateString, IsOptional } from 'class-validator';

export class ActualizarVinculoDto {
  @IsOptional()
  @IsDateString(
    {},
    { message: 'fechaInicio debe tener formato ISO válido (YYYY-MM-DD)' },
  )
  fechaInicio?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'fechaFin debe tener formato ISO válido (YYYY-MM-DD)' },
  )
  fechaFin?: string;
}
