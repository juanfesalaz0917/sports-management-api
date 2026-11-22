import { IsBoolean } from 'class-validator';

export class CambiarEstadoJugadorDto {
  @IsBoolean({ message: 'activo debe ser true o false' })
  activo!: boolean;
}
