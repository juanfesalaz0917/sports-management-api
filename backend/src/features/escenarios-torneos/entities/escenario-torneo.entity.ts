import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Escenario } from '../../escenarios/entities/escenario.entity';
import { Torneo } from '../../torneos/entities/torneo.entity';

@Entity('escenario_torneo')
export class EscenarioTorneo {
  @PrimaryColumn({ name: 'id_escenario', type: 'bigint' })
  escenarioId!: number;

  @PrimaryColumn({ name: 'id_torneo', type: 'bigint' })
  torneoId!: number;

  @ManyToOne(() => Escenario, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_escenario' })
  escenario!: Escenario;

  @ManyToOne(() => Torneo, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_torneo' })
  torneo!: Torneo;
}
