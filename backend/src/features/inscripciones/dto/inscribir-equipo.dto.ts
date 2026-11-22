import { IsInt } from 'class-validator';

export class InscribirEquipoDto {
  @IsInt({ message: 'equipoId debe ser un entero' })
  equipoId!: number;
}
