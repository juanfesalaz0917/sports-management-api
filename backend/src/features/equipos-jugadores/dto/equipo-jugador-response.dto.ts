export class EquipoJugadorResponseDto {
  id!: number;
  equipoId!: number;
  equipoNombre?: string;
  jugadorId!: number;
  jugadorNombre?: string;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  vigente!: boolean;
}
