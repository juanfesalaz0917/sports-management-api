import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('deporte')
export class Deporte {
  @PrimaryGeneratedColumn({ name: 'id_deporte' })
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;
}
