import { IsBoolean } from 'class-validator';

export class CambiarEstadoDeporteDto {
  @IsBoolean({ message: 'activo debe ser true o false' })
  activo!: boolean;
}
