import { Injectable } from '@nestjs/common';
import { EscenarioTorneoResponseDto } from '../dto/escenario-torneo-response.dto';
import { EscenarioTorneo } from '../entities/escenario-torneo.entity';

@Injectable()
export class EscenarioTorneoMapper {
  toResponseDto(entity: EscenarioTorneo): EscenarioTorneoResponseDto {
    return {
      escenarioId: Number(entity.escenarioId),
      escenarioNombre: entity.escenario?.nombre,
      escenarioDireccion: entity.escenario?.direccion ?? undefined,
      torneoId: Number(entity.torneoId),
      torneoNombre: entity.torneo?.nombre,
    };
  }

  toResponseDtoList(entities: EscenarioTorneo[]): EscenarioTorneoResponseDto[] {
    return entities.map((e) => this.toResponseDto(e));
  }
}
