import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Equipo } from '../../equipos/entities/equipo.entity';
import { Grupo } from './grupo.entity';

/**
 * Equipos de un grupo. id_fase está denormalizado: UNIQUE(id_fase, id_equipo) en BD
 * garantiza que un equipo solo esté en un grupo por fase.
 */
@Entity('grupo_equipo')
export class GrupoEquipo {
  @PrimaryColumn({ name: 'id_grupo', type: 'bigint' })
  grupoId!: number;

  @PrimaryColumn({ name: 'id_equipo', type: 'bigint' })
  equipoId!: number;

  @Column({ name: 'id_fase', type: 'bigint' })
  faseId!: number;

  @ManyToOne(() => Grupo, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_grupo' })
  grupo!: Grupo;

  @ManyToOne(() => Equipo, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_equipo' })
  equipo!: Equipo;
}
