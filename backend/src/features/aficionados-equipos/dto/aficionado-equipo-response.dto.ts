export class AficionadoEquipoResponseDto {
  id!: number;
  aficionadoId!: number;
  aficionadoNombre?: string;
  equipoId!: number;
  equipoNombre?: string;
  esFavoritoPrincipal!: boolean;
  fechaRegistro!: Date;
}
