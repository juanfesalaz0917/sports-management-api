export interface TablaPosicionFila {
  equipoId: number;
  equipoNombre: string;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
}

export class DesarrolloTorneoResponseDto {
  torneoId!: number;
  nombre!: string;
  estado!: string;
  fases!: Array<{
    faseId: number;
    nombre: string;
    tipo: string;
    orden: number;
    partidosConResultado: any[];
    partidosPendientes: any[];
    tablaPosiciones?: TablaPosicionFila[];
  }>;
}
