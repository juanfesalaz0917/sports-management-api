import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Deporte } from './deporte.entity';

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

  @ManyToOne(() => Deporte, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_deporte' })
  deporte!: Deporte;

  @Column({ name: 'id_deporte' })
  deporteId!: number;
}
