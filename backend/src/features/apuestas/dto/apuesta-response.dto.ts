export class ApuestaResponseDto {
  id!: number;
  monto!: number;
  fechaHora!: Date;
  estado?: string;
  aficionadoId!: number;
  aficionadoNombre?: string;
  partidoId!: number;
  metodoAficionadoId!: number;
}
