import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from '../../gateways/notifications/notifications.gateway';
import { PosicionElementoDto } from './dto/registrar-posiciones-lote.dto';

export interface PosicionRegistro extends PosicionElementoDto {
  partidoId: number;
  timestamp: string;
}

@Injectable()
export class PartidoPosicionesService {
  // Historial en memoria por partido para la pizarra en vivo (HU-GC-09)
  private readonly historial: Map<number, PosicionRegistro[]> = new Map();

  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  registrarLote(partidoId: number, dto: any): PosicionRegistro[] {
    const id = Number(partidoId);
    const existentes = this.historial.get(id) || [];
    const ahora = new Date().toISOString();

    let lista: PosicionElementoDto[] = [];
    if (Array.isArray(dto)) {
      lista = dto;
    } else if (dto && Array.isArray(dto.posiciones)) {
      lista = dto.posiciones;
    } else if (dto && typeof dto === 'object') {
      for (const k of Object.keys(dto)) {
        if (Array.isArray(dto[k])) {
          lista = dto[k];
          break;
        }
      }
    }

    const nuevos: PosicionRegistro[] = lista.map((p) => ({
      ...p,
      partidoId: id,
      timestamp: p.timestamp || ahora,
    }));

    const actualizado = [...existentes, ...nuevos];
    this.historial.set(id, actualizado);

    // Broadcast WebSocket inmediato a los clientes conectados a la pizarra
    this.notificationsGateway.broadcast(`partido_${id}_posiciones`, nuevos);

    return nuevos;
  }

  obtenerUltimas(partidoId: number): PosicionRegistro[] {
    const id = Number(partidoId);
    const todos = this.historial.get(id) || [];
    const mapa = new Map<string, PosicionRegistro>();

    for (const reg of todos) {
      const clave = reg.esPelota ? 'pelota' : `jugador_${reg.jugadorId}`;
      mapa.set(clave, reg);
    }

    return Array.from(mapa.values());
  }

  obtenerHistorial(partidoId: number, desde?: string): PosicionRegistro[] {
    const id = Number(partidoId);
    const todos = this.historial.get(id) || [];
    if (!desde) return todos;
    const fechaDesde = new Date(desde).getTime();
    return todos.filter((p) => new Date(p.timestamp).getTime() >= fechaDesde);
  }
}
