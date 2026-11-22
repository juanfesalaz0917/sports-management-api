export class PartidoResponseDto {
  id!: number;
  fechaHora!: Date;
  estado?: string;
  torneoId!: number;
  torneoNombre?: string;
  faseId?: number;
  faseNombre?: string;
  escenarioId!: number;
  escenarioNombre?: string;
  equipoLocalId?: number;
  equipoLocalNombre?: string;
  equipoVisitanteId?: number;
  equipoVisitanteNombre?: string;
  pelotaId?: number;
}
