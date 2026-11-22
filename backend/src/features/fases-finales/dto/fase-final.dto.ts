import { IsIn, IsInt } from 'class-validator';

/** Llaves de la fase final, de mayor a menor número de equipos. */
export const MODALIDADES_FINAL = [
  'OCTAVOS',
  'CUARTOS',
  'SEMIFINAL',
  'FINAL',
] as const;

export class CreateFaseFinalDto {
  @IsInt({ message: 'faseId debe ser un entero' })
  faseId!: number;

  @IsIn(MODALIDADES_FINAL, {
    message: 'modalidad debe ser OCTAVOS, CUARTOS, SEMIFINAL o FINAL',
  })
  modalidad!: (typeof MODALIDADES_FINAL)[number];
}

export class UpdateFaseFinalDto {
  @IsIn(MODALIDADES_FINAL, {
    message: 'modalidad debe ser OCTAVOS, CUARTOS, SEMIFINAL o FINAL',
  })
  modalidad!: (typeof MODALIDADES_FINAL)[number];
}

export class FaseFinalResponseDto {
  faseId!: number;
  faseNombre?: string;
  torneoId!: number;
  modalidad?: string;
}
