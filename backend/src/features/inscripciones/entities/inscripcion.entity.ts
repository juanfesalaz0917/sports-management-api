import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Equipo } from '../../equipos/entities/equipo.entity';
import { Torneo } from '../../torneos/entities/torneo.entity';

@Entity('inscripcion')
@Unique('uq_inscripcion_torneo_equipo', ['torneoId', 'equipoId'])
export class Inscripcion {
  @PrimaryGeneratedColumn({ name: 'id_inscripcion' })
  id!: number;

  @Column({ name: 'id_torneo', type: 'bigint' })
  torneoId!: number;

  @Column({ name: 'id_equipo', type: 'bigint' })
  equipoId!: number;

  @Column({ name: 'fecha_inscripcion', type: 'date', nullable: true })
  fechaInscripcion?: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  estado?: string;

  @ManyToOne(() => Torneo, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_torneo' })
  torneo!: Torneo;

  @ManyToOne(() => Equipo, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_equipo' })
  equipo!: Equipo;
}
