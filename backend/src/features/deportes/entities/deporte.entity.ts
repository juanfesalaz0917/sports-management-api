import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('deporte')
export class Deporte {
  @PrimaryGeneratedColumn({ name: 'id_deporte' })
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  // Subdeportes: un deporte puede tener un deporte padre (HU-GD-01)
  @ManyToOne(() => Deporte, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_deporte_padre' })
  deportePadre?: Deporte | null;

  @Column({ name: 'id_deporte_padre', type: 'bigint', nullable: true })
  deportePadreId?: number | null;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;
}
