import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateGrupoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del grupo es obligatorio' })
  @MaxLength(50, {
    message: 'El nombre del grupo no puede superar 50 caracteres',
  })
  nombreGrupo!: string;
}
