import { IsBoolean } from 'class-validator';

export class CambiarEstadoEquipoDto {
  @IsBoolean({ message: 'activo debe ser true o false' })
  activo!: boolean;
}
