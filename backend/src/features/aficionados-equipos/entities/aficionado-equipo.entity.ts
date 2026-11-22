import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Aficionado } from '../../aficionados/entities/aficionado.entity';
import { Equipo } from '../../stubs/entities/equipo.entity';

@Entity('aficionado_equipo')
export class AficionadoEquipo {
  @PrimaryColumn({ name: 'id_aficionado', type: 'bigint' })
  aficionadoId!: number;

  @PrimaryColumn({ name: 'id_equipo', type: 'bigint' })
  equipoId!: number;

  @ManyToOne(() => Aficionado, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_aficionado' })
  aficionado!: Aficionado;

  @ManyToOne(() => Equipo, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_equipo' })
  equipo!: Equipo;
}
