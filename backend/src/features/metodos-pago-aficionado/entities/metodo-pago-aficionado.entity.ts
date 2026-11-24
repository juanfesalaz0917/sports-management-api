import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Aficionado } from '../../aficionados/entities/aficionado.entity';
import { MetodoPago } from '../../metodos-pago/entities/metodo-pago.entity';

@Entity('metodo_pago_aficionado')
@Unique('uq_metodo_aficionado', ['id', 'aficionadoId'])
export class MetodoPagoAficionado {
  @PrimaryGeneratedColumn({ name: 'id_metodo_aficionado' })
  id!: number;

  @ManyToOne(() => Aficionado, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_aficionado' })
  aficionado!: Aficionado;

  @Column({ name: 'id_aficionado', type: 'bigint' })
  aficionadoId!: number;

  @ManyToOne(() => MetodoPago, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_metodo_pago' })
  metodoPago!: MetodoPago;

  @Column({ name: 'id_metodo_pago', type: 'bigint' })
  metodoPagoId!: number;

  @Column({ length: 150, nullable: true })
  referencia?: string;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;
}
