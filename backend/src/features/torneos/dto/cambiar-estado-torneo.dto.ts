import { IsIn } from 'class-validator';

export const ESTADOS_TORNEO = [
  'INSCRIPCIONES_ABIERTAS',
  'EN_CURSO',
  'FINALIZADO',
  'CANCELADO',
] as const;

export class CambiarEstadoTorneoDto {
  @IsIn(ESTADOS_TORNEO, {
    message:
      'estado debe ser INSCRIPCIONES_ABIERTAS, EN_CURSO, FINALIZADO o CANCELADO',
  })
  estado!: (typeof ESTADOS_TORNEO)[number];
}
