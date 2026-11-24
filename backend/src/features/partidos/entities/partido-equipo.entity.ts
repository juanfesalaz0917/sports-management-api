import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Equipo } from '../../equipos/entities/equipo.entity';
import { Partido } from './partido.entity';

@Entity('partido_equipo')
export class PartidoEquipo {
  @PrimaryColumn({ name: 'id_partido', type: 'bigint' })
  partidoId!: number;

  @PrimaryColumn({ type: 'enum', enum: ['LOCAL', 'VISITANTE'] })
  rol!: 'LOCAL' | 'VISITANTE';

  @Column({ name: 'id_equipo', type: 'bigint' })
  equipoId!: number;

  @ManyToOne(() => Partido, (p) => p.equipos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_partido' })
  partido!: Partido;

  @ManyToOne(() => Equipo, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_equipo' })
  equipo!: Equipo;
}
