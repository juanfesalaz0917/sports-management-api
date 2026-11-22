import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('posicion_espacial')
export class PosicionEspacial {
  @PrimaryGeneratedColumn({ name: 'id_posicion' })
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;
}
