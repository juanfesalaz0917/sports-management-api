import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Torneo } from '../../torneos/entities/torneo.entity';

@Entity('fase')
export class Fase {
  @PrimaryGeneratedColumn({ name: 'id_fase' })
  id!: number;

  @Column({ length: 100, nullable: true })
  nombre?: string;

  @Column({ type: 'enum', enum: ['GRUPO', 'FINAL'] })
  tipo!: 'GRUPO' | 'FINAL';

  // Orden de ejecución dentro del torneo (único por torneo: lo valida el servicio)
  @Column({ type: 'int', default: 1 })
  orden!: number;

  @ManyToOne(() => Torneo, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_torneo' })
  torneo!: Torneo;

  @Column({ name: 'id_torneo' })
  torneoId!: number;
}
