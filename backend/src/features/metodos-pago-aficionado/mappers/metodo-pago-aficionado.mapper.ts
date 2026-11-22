import { Injectable } from '@nestjs/common';
import { CreateMetodoPagoAficionadoDto } from '../dto/create-metodo-pago-aficionado.dto';
import { MetodoPagoAficionadoResponseDto } from '../dto/metodo-pago-aficionado-response.dto';
import { MetodoPagoAficionado } from '../entities/metodo-pago-aficionado.entity';

@Injectable()
export class MetodoPagoAficionadoMapper {
  toEntity(
    aficionadoId: number,
    dto: CreateMetodoPagoAficionadoDto,
  ): MetodoPagoAficionado {
    const m = new MetodoPagoAficionado();
    m.aficionadoId = aficionadoId;
    m.metodoPagoId = dto.metodoPagoId;
    m.referencia = dto.referencia;
    return m;
  }

  toResponseDto(entity: MetodoPagoAficionado): MetodoPagoAficionadoResponseDto {
    return {
      id: entity.id,
      aficionadoId: Number(entity.aficionadoId),
      aficionadoNombre: entity.aficionado?.nombre,
      metodoPagoId: Number(entity.metodoPagoId),
      metodoPagoNombre: entity.metodoPago?.nombre,
      referencia: entity.referencia,
    };
  }

  toResponseDtoList(entities: MetodoPagoAficionado[]): MetodoPagoAficionadoResponseDto[] {
    return entities.map((e) => this.toResponseDto(e));
  }
}
