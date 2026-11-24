import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Aficionado } from '../../aficionados/entities/aficionado.entity';
import { MetodoPagoAficionado } from '../../metodos-pago-aficionado/entities/metodo-pago-aficionado.entity';
import { Partido } from '../../partidos/entities/partido.entity';

@Entity('apuesta')
export class Apuesta {
  @PrimaryGeneratedColumn({ name: 'id_apuesta' })
  id!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monto!: number;

  @Column({ name: 'fecha_hora', type: 'datetime' })
  fechaHora!: Date;

  @Column({ length: 30, nullable: true })
  estado?: string;

  @ManyToOne(() => Aficionado, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_aficionado' })
  aficionado!: Aficionado;

  @Column({ name: 'id_aficionado', type: 'bigint' })
  aficionadoId!: number;

  @ManyToOne(() => Partido, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_partido' })
  partido!: Partido;

  @Column({ name: 'id_partido', type: 'bigint' })
  partidoId!: number;

  @ManyToOne(() => MetodoPagoAficionado, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_metodo_aficionado' })
  metodoAficionado!: MetodoPagoAficionado;

  @Column({ name: 'id_metodo_aficionado', type: 'bigint' })
  metodoAficionadoId!: number;

  // Equipo por el que apuesta el aficionado (necesario para liquidar correctamente)
  @Column({ name: 'id_equipo_seleccionado', type: 'bigint', nullable: true })
  equipoId?: number;
}
