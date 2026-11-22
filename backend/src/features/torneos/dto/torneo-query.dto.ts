import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { PageQueryDto } from '../../../core/pagination/page-query.dto';
import { toBoolean } from '../../../core/utils/transform.util';
import { ESTADOS_TORNEO } from './cambiar-estado-torneo.dto';

export class TorneoQueryDto extends PageQueryDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsIn(ESTADOS_TORNEO)
  estado?: (typeof ESTADOS_TORNEO)[number];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  deporteId?: number;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  activo?: boolean;
}
