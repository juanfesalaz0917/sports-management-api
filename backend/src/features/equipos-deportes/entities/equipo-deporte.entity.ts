import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Deporte } from '../../deportes/entities/deporte.entity';
import { Equipo } from '../../equipos/entities/equipo.entity';

@Entity('equipo_deporte')
export class EquipoDeporte {
  @PrimaryColumn({ name: 'id_equipo', type: 'bigint' })
  equipoId!: number;

  @PrimaryColumn({ name: 'id_deporte', type: 'bigint' })
  deporteId!: number;

  @ManyToOne(() => Equipo, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_equipo' })
  equipo!: Equipo;

  @ManyToOne(() => Deporte, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_deporte' })
  deporte!: Deporte;
}
