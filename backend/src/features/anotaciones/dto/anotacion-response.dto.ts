export class AnotacionResponseDto {
  id!: number;
  partidoId!: number;
  jugadorId!: number;
  jugadorNombre?: string;
  minuto!: number;
  tipo!: string;
  descripcion?: string;
}
