import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Aficionado } from '../../aficionados/entities/aficionado.entity';
import { Localidad } from '../../localidades/entities/localidad.entity';
import { Partido } from '../../partidos/entities/partido.entity';

@Entity('boleto')
export class Boleto {
  @PrimaryGeneratedColumn({ name: 'id_boleto' })
  id!: number;

  @Column({ length: 100, unique: true })
  codigo!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  precio!: number;

  @Column({ length: 30, nullable: true })
  estado?: string;

  @ManyToOne(() => Partido, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_partido' })
  partido!: Partido;

  @Column({ name: 'id_partido', type: 'bigint' })
  partidoId!: number;

  @ManyToOne(() => Localidad, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_localidad' })
  localidad!: Localidad;

  @Column({ name: 'id_localidad', type: 'bigint' })
  localidadId!: number;

  @ManyToOne(() => Aficionado, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_aficionado' })
  aficionado?: Aficionado;

  @Column({ name: 'id_aficionado', type: 'bigint', nullable: true })
  aficionadoId?: number;
}
