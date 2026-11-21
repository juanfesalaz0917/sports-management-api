import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLocalidadDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la localidad es obligatorio' })
  nombre!: string;

  @IsInt()
  @IsOptional()
  capacidad?: number;

  @IsInt()
  escenarioId!: number;
}
