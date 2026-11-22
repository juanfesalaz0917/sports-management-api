import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hoyISO } from '../../../core/utils/fecha.util';
import { Anotacion } from '../../anotaciones/entities/anotacion.entity';
import { EquipoJugador } from '../../equipos-jugadores/entities/equipo-jugador.entity';
import { PosicionEspacial } from '../../posiciones-espaciales/entities/posicion-espacial.entity';
import { Jugador } from '../entities/jugador.entity';

@Injectable()
export class JugadorValidator {
  constructor(
    @InjectRepository(Jugador)
    private readonly repo: Repository<Jugador>,
    @InjectRepository(PosicionEspacial)
    private readonly posicionRepo: Repository<PosicionEspacial>,
    @InjectRepository(EquipoJugador)
    private readonly equipoJugadorRepo: Repository<EquipoJugador>,
    @InjectRepository(Anotacion)
    private readonly anotacionRepo: Repository<Anotacion>,
  ) {}

  validarFechaNacimiento(fecha?: string): void {
    if (fecha && fecha.slice(0, 10) > hoyISO()) {
      throw new BadRequestException('La fecha de nacimiento no puede ser futura');
    }
  }

  async validarDocumentoUnico(documento: string, excluirId?: number): Promise<void> {
    const existente = await this.repo.findOne({ where: { documento: documento.trim() } });
    if (existente && Number(existente.id) !== excluirId) {
      throw new ConflictException(`Ya existe un jugador con el documento "${documento}"`);
    }
  }

  async validarPosicion(posicionId: number): Promise<void> {
    const posicion = await this.posicionRepo.findOne({ where: { id: posicionId } });
    if (!posicion) throw new NotFoundException(`Posición ${posicionId} no existe`);
  }

  async validarSinAsociaciones(id: number): Promise<void> {
    const [equipos, anotaciones] = await Promise.all([
      this.equipoJugadorRepo.count({ where: { jugadorId: id } }),
      this.anotacionRepo.count({ where: { jugadorId: id } }),
    ]);
    const motivos: string[] = [];
    if (equipos) motivos.push(`${equipos} vínculo(s) con equipos`);
    if (anotaciones) motivos.push(`${anotaciones} anotación(es)`);
    if (motivos.length) {
      throw new ConflictException(
        `No se puede eliminar el jugador ${id}: tiene ${motivos.join(', ')} asociado(s). Puede desactivarlo en su lugar.`,
      );
    }
  }
}
