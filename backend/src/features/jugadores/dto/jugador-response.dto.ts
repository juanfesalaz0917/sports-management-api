export class JugadorResponseDto {
  id!: number;
  nombre!: string;
  apellido?: string;
  documento?: string | null;
  fechaNacimiento?: string;
  posicionId?: number | null;
  posicionNombre?: string;
  activo!: boolean;
}

export class PerfilEquipoDto {
  vinculoId!: number;
  equipoId!: number;
  equipoNombre?: string;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  vigente!: boolean;
}

export class PerfilHabilidadDto {
  habilidadId!: number;
  nombre?: string;
  descripcion?: string;
}

/** HU-GD-08: datos básicos + equipos (historial) + habilidades (las provee B). */
export class JugadorPerfilDto extends JugadorResponseDto {
  equipos!: PerfilEquipoDto[];
  habilidades!: PerfilHabilidadDto[];
  mensajeEquipos?: string;
  mensajeHabilidades?: string;
}
