import { IsBoolean } from 'class-validator';

export class CambiarEstadoEscenarioDto {
  @IsBoolean({ message: 'activo debe ser true o false' })
  activo!: boolean;
}
