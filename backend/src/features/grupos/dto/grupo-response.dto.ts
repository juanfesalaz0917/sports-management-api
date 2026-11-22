export class GrupoResponseDto {
  id!: number;
  faseId!: number;
  faseNombre?: string;
  nombreGrupo?: string;
  totalEquipos?: number;
}

export class GrupoEquipoResponseDto {
  grupoId!: number;
  faseId!: number;
  equipoId!: number;
  equipoNombre?: string;
}
