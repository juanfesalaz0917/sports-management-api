import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePelotaDto {
  @IsString()
  @IsNotEmpty({ message: 'La referencia de la pelota es obligatoria' })
  referencia!: string;

  @IsString()
  @IsOptional()
  marca?: string;
}
