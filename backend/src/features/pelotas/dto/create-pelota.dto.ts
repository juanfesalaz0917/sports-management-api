import { IsOptional, IsString } from 'class-validator';

export class CreatePelotaDto {
  @IsString()
  @IsOptional()
  referencia?: string;

  @IsString()
  @IsOptional()
  marca?: string;
}
