import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('jugador')
export class Jugador {
  @PrimaryGeneratedColumn({ name: 'id_jugador' })
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 100, nullable: true })
  apellido?: string;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  fechaNacimiento?: string;

  @Column({ name: 'id_posicion', type: 'bigint', nullable: true })
  posicionId?: number;
}
