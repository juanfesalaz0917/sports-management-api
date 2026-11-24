import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Partido } from '../../partidos/entities/partido.entity';
import { Jugador } from '../../jugadores/entities/jugador.entity';
import { Pelota } from '../../pelotas/entities/pelota.entity';

@Entity('posicion_espacial')
@Index('idx_posicion_partido_timestamp', ['partidoId', 'timestamp'])
@Index('idx_posicion_jugador_timestamp', ['jugadorId', 'timestamp'])
export class PosicionEspacial {
  @PrimaryGeneratedColumn({ name: 'id_posicion' })
  id!: number;

  @Column({ name: 'nombre', length: 100, nullable: true })
  nombre?: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion?: string;

  @ManyToOne(() => Partido, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_partido' })
  partido!: Partido;

  @Column({ name: 'id_partido', type: 'bigint' })
  partidoId!: number;

  @ManyToOne(() => Jugador, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_jugador' })
  jugador?: Jugador;

  @Column({ name: 'id_jugador', type: 'bigint', nullable: true })
  jugadorId?: number | null;

  @ManyToOne(() => Pelota, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_pelota' })
  pelota?: Pelota;

  @Column({ name: 'id_pelota', type: 'bigint', nullable: true })
  pelotaId?: number | null;

  @Column({ name: 'es_pelota', type: 'tinyint', default: false })
  esPelota!: boolean;

  @Column({ name: 'x', type: 'decimal', precision: 8, scale: 4 })
  x!: number;

  @Column({ name: 'y', type: 'decimal', precision: 8, scale: 4 })
  y!: number;

  @Column({ name: 'timestamp', type: 'datetime', precision: 3 })
  timestamp!: Date;
}
