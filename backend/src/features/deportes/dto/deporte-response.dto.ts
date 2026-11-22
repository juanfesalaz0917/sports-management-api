export class DeporteResponseDto {
  id!: number;
  nombre!: string;
  descripcion?: string;
  deportePadreId?: number | null;
  deportePadreNombre?: string;
  activo!: boolean;
}
