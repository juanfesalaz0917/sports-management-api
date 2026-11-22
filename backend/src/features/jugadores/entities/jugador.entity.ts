import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('jugador')
export class Jugador {
  @PrimaryGeneratedColumn({ name: 'id_jugador' })
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 100, nullable: true })
  apellido?: string;

  @Column({ type: 'varchar', length: 30, nullable: true, unique: true })
  documento?: string | null;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  fechaNacimiento?: string;

  // FK a posicion_espacial (entidad de B); se mantiene plana como en el stub
  @Column({ name: 'id_posicion', type: 'bigint', nullable: true })
  posicionId?: number;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;
}
