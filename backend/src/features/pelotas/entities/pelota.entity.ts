import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pelota')
export class Pelota {
  @PrimaryGeneratedColumn({ name: 'id_pelota' })
  id!: number;

  @Column({ length: 100, nullable: true })
  referencia?: string;

  @Column({ length: 100, nullable: true })
  marca?: string;
}
