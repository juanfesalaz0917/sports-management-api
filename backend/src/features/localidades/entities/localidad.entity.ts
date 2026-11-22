import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Escenario } from '../../stubs/entities/escenario.entity';

@Entity('localidad')
export class Localidad {
  @PrimaryGeneratedColumn({ name: 'id_localidad' })
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ type: 'int', nullable: true })
  capacidad?: number;

  @ManyToOne(() => Escenario, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_escenario' })
  escenario!: Escenario;

  @Column({ name: 'id_escenario', type: 'bigint' })
  escenarioId!: number;
}
