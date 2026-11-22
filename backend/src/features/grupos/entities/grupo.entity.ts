import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Fase } from '../../fases/entities/fase.entity';

@Entity('grupo')
export class Grupo {
  @PrimaryGeneratedColumn({ name: 'id_grupo' })
  id!: number;

  @Column({ name: 'id_fase', type: 'bigint' })
  faseId!: number;

  @Column({ name: 'nombre_grupo', type: 'varchar', length: 50, nullable: true })
  nombreGrupo?: string;

  @ManyToOne(() => Fase, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_fase' })
  fase!: Fase;
}
