export class InscripcionResponseDto {
  id!: number;
  torneoId!: number;
  torneoNombre?: string;
  equipoId!: number;
  equipoNombre?: string;
  fechaInscripcion?: string;
  estado?: string;
}
