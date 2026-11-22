export class EscenarioResponseDto {
  id!: number;
  nombre!: string;
  direccion?: string;
  escenarioPadreId?: number | null;
  escenarioPadreNombre?: string;
  activo!: boolean;
}
