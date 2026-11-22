import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PageQueryDto } from '../../../core/pagination/page-query.dto';
import { toBoolean } from '../../../core/utils/transform.util';

export class EscenarioQueryDto extends PageQueryDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  activo?: boolean;

  // true = solo escenarios raíz (complejos), sin padre
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  soloRaiz?: boolean;
}
