import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
import { PageQueryDto } from '../../../core/pagination/page-query.dto';
import { toBoolean } from '../../../core/utils/transform.util';
import { GENEROS_EQUIPO } from './create-equipo.dto';

export class EquipoQueryDto extends PageQueryDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsIn(GENEROS_EQUIPO)
  genero?: 'MASCULINO' | 'FEMENINO' | 'MIXTO';

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  activo?: boolean;
}
