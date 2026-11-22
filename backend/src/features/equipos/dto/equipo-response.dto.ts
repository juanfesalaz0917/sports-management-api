export class EquipoResponseDto {
  id!: number;
  nombre!: string;
  genero?: string | null;
  fechaCreacion?: string;
  activo!: boolean;
}
