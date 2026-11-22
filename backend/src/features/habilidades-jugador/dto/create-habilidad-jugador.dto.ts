import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class CreateHabilidadJugadorDto {
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  nivel?: number;
}
