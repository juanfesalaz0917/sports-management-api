import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { toBoolean } from '../../../core/utils/transform.util';

export class VinculoQueryDto {
  // true = solo vínculos vigentes; false = solo históricos; sin valor = todos
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  vigentes?: boolean;
}
