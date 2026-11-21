import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('escenario')
export class Escenario {
  @PrimaryGeneratedColumn({ name: 'id_escenario' })
  id!: number;

  @Column({ length: 150 })
  nombre!: string;

  @Column({ length: 255, nullable: true })
  direccion?: string;
}
