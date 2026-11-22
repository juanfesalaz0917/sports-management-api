import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('habilidad')
export class Habilidad {
  @PrimaryGeneratedColumn({ name: 'id_habilidad' })
  id!: number;

  @Column({ length: 100, unique: true })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;
}
