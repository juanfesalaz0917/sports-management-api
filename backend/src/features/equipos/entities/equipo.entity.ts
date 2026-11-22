import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('equipo')
export class Equipo {
  @PrimaryGeneratedColumn({ name: 'id_equipo' })
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({
    type: 'enum',
    enum: ['MASCULINO', 'FEMENINO', 'MIXTO'],
    nullable: true,
  })
  genero?: 'MASCULINO' | 'FEMENINO' | 'MIXTO' | null;

  @Column({ name: 'fecha_creacion', type: 'date', nullable: true })
  fechaCreacion?: string;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;
}
