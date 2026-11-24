import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Habilidad } from '../../habilidades/entities/habilidad.entity';
import { Jugador } from '../../jugadores/entities/jugador.entity';

@Entity('habilidad_jugador')
export class HabilidadJugador {
  @PrimaryColumn({ name: 'id_jugador', type: 'bigint' })
  jugadorId!: number;

  @PrimaryColumn({ name: 'id_habilidad', type: 'bigint' })
  habilidadId!: number;

  @ManyToOne(() => Jugador, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_jugador' })
  jugador!: Jugador;

  @ManyToOne(() => Habilidad, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_habilidad' })
  habilidad!: Habilidad;
}
