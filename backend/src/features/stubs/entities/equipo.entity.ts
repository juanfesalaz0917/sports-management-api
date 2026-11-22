import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('equipo')
export class Equipo {
  @PrimaryGeneratedColumn({ name: 'id_equipo' })
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ name: 'fecha_creacion', type: 'date', nullable: true })
  fechaCreacion?: string;
}
