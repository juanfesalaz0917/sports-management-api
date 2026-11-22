import { IsInt, Min } from 'class-validator';

export class RegistrarResultadoDto {
  @IsInt()
  @Min(0, { message: 'El marcador no puede ser negativo' })
  marcadorLocal!: number;

  @IsInt()
  @Min(0, { message: 'El marcador no puede ser negativo' })
  marcadorVisitante!: number;
}
