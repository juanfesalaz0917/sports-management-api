import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Fase } from '../../fases/entities/fase.entity';

@Entity('fase_final')
export class FaseFinal {
  @PrimaryColumn({ name: 'id_fase', type: 'bigint' })
  faseId!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  modalidad?: string;

  @OneToOne(() => Fase, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_fase' })
  fase!: Fase;
}
