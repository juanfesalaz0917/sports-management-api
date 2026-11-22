import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePartidoEstadoDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['PROGRAMADO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO'], {
    message: 'Estado debe ser PROGRAMADO, EN_CURSO, FINALIZADO o CANCELADO',
  })
  estado!: string;
}
