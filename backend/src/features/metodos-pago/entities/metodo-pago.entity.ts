import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('metodo_pago')
export class MetodoPago {
  @PrimaryGeneratedColumn({ name: 'id_metodo_pago' })
  id!: number;

  @Column({ length: 100, unique: true })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;
}
