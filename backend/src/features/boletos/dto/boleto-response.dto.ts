export class BoletoResponseDto {
  id!: number;
  codigo!: string;
  precio!: number;
  estado?: string;
  partidoId!: number;
  localidadId!: number;
  localidadNombre?: string;
  aficionadoId?: number;
  aficionadoNombre?: string;
}
