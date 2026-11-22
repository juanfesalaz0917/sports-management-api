import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Equipo } from '../../equipos/entities/equipo.entity';
import { Jugador } from '../../jugadores/entities/jugador.entity';

/**
 * Historial de traspasos: un jugador puede pasar por varios equipos y volver a uno
 * anterior. Vínculo vigente = fechaFin nula (o igual/posterior a hoy).
 * fechaInicio se guarda en la columna original fecha_vinculacion.
 */
@Entity('equipo_jugador')
export class EquipoJugador {
  @PrimaryGeneratedColumn({ name: 'id_equipo_jugador' })
  id!: number;

  @Column({ name: 'id_equipo', type: 'bigint' })
  equipoId!: number;

  @Column({ name: 'id_jugador', type: 'bigint' })
  jugadorId!: number;

  @Column({ name: 'fecha_vinculacion', type: 'date', nullable: true })
  fechaInicio?: string | null;

  @Column({ name: 'fecha_fin', type: 'date', nullable: true })
  fechaFin?: string | null;

  @ManyToOne(() => Equipo, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_equipo' })
  equipo!: Equipo;

  @ManyToOne(() => Jugador, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_jugador' })
  jugador!: Jugador;
}
