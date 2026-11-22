export class TorneoResponseDto {
  id!: number;
  nombre!: string;
  fechaInicio?: string;
  fechaFin?: string;
  fechaCierreInscripciones?: string | null;
  estado!: string;
  deporteId!: number;
  deporteNombre?: string;
  activo!: boolean;
}

export class EstructuraEquipoDto {
  equipoId!: number;
  equipoNombre?: string;
}

export class EstructuraGrupoDto {
  grupoId!: number;
  nombreGrupo?: string;
  equipos!: EstructuraEquipoDto[];
}

export class EstructuraFaseDto {
  faseId!: number;
  nombre?: string;
  tipo!: string;
  orden!: number;
  grupos?: EstructuraGrupoDto[];
  modalidad?: string | null;
}

/** Contrato interno para B: fases ordenadas, grupos con sus equipos y fase final. */
export class EstructuraTorneoDto {
  torneoId!: number;
  torneoNombre!: string;
  estado!: string;
  fases!: EstructuraFaseDto[];
}
