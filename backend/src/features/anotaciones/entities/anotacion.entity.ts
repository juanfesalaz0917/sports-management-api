import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Partido } from '../../partidos/entities/partido.entity';
import { Jugador } from '../../stubs/entities/jugador.entity';

@Entity('anotacion')
export class Anotacion {
  @PrimaryGeneratedColumn({ name: 'id_anotacion' })
  id!: number;

  @Column({ type: 'int' })
  minuto!: number;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @ManyToOne(() => Partido, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_partido' })
  partido!: Partido;

  @Column({ name: 'id_partido', type: 'bigint' })
  partidoId!: number;

  @ManyToOne(() => Jugador, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_jugador' })
  jugador!: Jugador;

  @Column({ name: 'id_jugador', type: 'bigint' })
  jugadorId!: number;
}
