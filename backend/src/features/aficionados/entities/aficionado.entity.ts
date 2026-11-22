import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('aficionado')
export class Aficionado {
  @PrimaryGeneratedColumn({ name: 'id_aficionado' })
  id!: number;

  @Column({ name: 'usuario_id', type: 'bigint', unique: true })
  usuarioId!: number;

  @Column({ length: 100, nullable: true })
  nombre?: string;

  @Column({ length: 100, nullable: true })
  apellido?: string;

  @Column({ length: 20, nullable: true })
  telefono?: string;

  @Column({ name: 'fecha_registro', type: 'datetime' })
  fechaRegistro!: Date;
}
