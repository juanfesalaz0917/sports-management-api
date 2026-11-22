import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Deporte } from '../../deportes/entities/deporte.entity';

export type EstadoTorneo =
  'INSCRIPCIONES_ABIERTAS' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO';

@Entity('torneo')
export class Torneo {
  @PrimaryGeneratedColumn({ name: 'id_torneo' })
  id!: number;

  @Column({ length: 150 })
  nombre!: string;

  @Column({ name: 'fecha_inicio', type: 'date', nullable: true })
  fechaInicio?: string;

  @Column({ name: 'fecha_fin', type: 'date', nullable: true })
  fechaFin?: string;

  @Column({
    type: 'enum',
    enum: ['INSCRIPCIONES_ABIERTAS', 'EN_CURSO', 'FINALIZADO', 'CANCELADO'],
    default: 'INSCRIPCIONES_ABIERTAS',
  })
  estado!: EstadoTorneo;

  @Column({ name: 'fecha_cierre_inscripciones', type: 'date', nullable: true })
  fechaCierreInscripciones?: string | null;

  @ManyToOne(() => Deporte, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_deporte' })
  deporte!: Deporte;

  @Column({ name: 'id_deporte' })
  deporteId!: number;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;
}
