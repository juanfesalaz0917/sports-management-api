import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('escenario')
export class Escenario {
  @PrimaryGeneratedColumn({ name: 'id_escenario' })
  id!: number;

  @Column({ length: 150 })
  nombre!: string;

  @Column({ length: 255, nullable: true })
  direccion?: string;

  // Jerarquía: un complejo deportivo contiene otros espacios
  @ManyToOne(() => Escenario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_escenario_padre' })
  escenarioPadre?: Escenario | null;

  @Column({ name: 'id_escenario_padre', type: 'bigint', nullable: true })
  escenarioPadreId?: number | null;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;
}
