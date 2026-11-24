import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Escenario } from '../../escenarios/entities/escenario.entity';
import { Fase } from '../../fases/entities/fase.entity';
import { Torneo } from '../../torneos/entities/torneo.entity';
import { Pelota } from '../../pelotas/entities/pelota.entity';
import { PartidoEquipo } from './partido-equipo.entity';

@Entity('partido')
export class Partido {
  @PrimaryGeneratedColumn({ name: 'id_partido' })
  id!: number;

  @Column({ name: 'fecha_hora', type: 'datetime' })
  fechaHora!: Date;

  @Column({ length: 30, nullable: true })
  estado?: string;

  @ManyToOne(() => Torneo, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_torneo' })
  torneo!: Torneo;

  @Column({ name: 'id_torneo', type: 'bigint' })
  torneoId!: number;

  @ManyToOne(() => Fase, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_fase' })
  fase?: Fase;

  @Column({ name: 'id_fase', type: 'bigint', nullable: true })
  faseId?: number;

  @ManyToOne(() => Escenario, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_escenario' })
  escenario!: Escenario;

  @Column({ name: 'id_escenario', type: 'bigint' })
  escenarioId!: number;

  @ManyToOne(() => Pelota, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_pelota' })
  pelota?: Pelota;

  @Column({ name: 'id_pelota', type: 'bigint', nullable: true })
  pelotaId?: number;

  @OneToMany(() => PartidoEquipo, (pe) => pe.partido)
  equipos?: PartidoEquipo[];
}
