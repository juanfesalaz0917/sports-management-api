import { IsInt } from 'class-validator';

export class AgregarEquipoGrupoDto {
  @IsInt({ message: 'equipoId debe ser un entero' })
  equipoId!: number;
}
