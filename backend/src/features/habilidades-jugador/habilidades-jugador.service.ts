import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabilidadJugador } from './entities/habilidad-jugador.entity';
import { Habilidad } from '../habilidades/entities/habilidad.entity';
import { Jugador } from '../jugadores/entities/jugador.entity';

@Injectable()
export class HabilidadesJugadorService {
  constructor(
    @InjectRepository(HabilidadJugador)
    private readonly repo: Repository<HabilidadJugador>,
    @InjectRepository(Jugador)
    private readonly jugadorRepo: Repository<Jugador>,
    @InjectRepository(Habilidad)
    private readonly habilidadRepo: Repository<Habilidad>,
  ) {}

  async assign(jugadorId: number, habilidadId: number) {
    const jugador = await this.jugadorRepo.findOne({ where: { id: jugadorId } });
    if (!jugador) throw new NotFoundException(`Jugador ${jugadorId} no encontrado`);

    const habilidad = await this.habilidadRepo.findOne({ where: { id: habilidadId } });
    if (!habilidad) throw new NotFoundException(`Habilidad ${habilidadId} no encontrada`);

    const exists = await this.repo.findOne({ where: { jugadorId, habilidadId } });
    if (exists) throw new ConflictException('El jugador ya tiene asignada esta habilidad');

    const entity = this.repo.create({ jugadorId, habilidadId });
    try {
      await this.repo.save(entity);
    } catch (e) {
      if ((e as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('El jugador ya tiene asignada esta habilidad');
      }
      throw e;
    }
    return { jugadorId, jugadorNombre: jugador.nombre, habilidadId, habilidadNombre: habilidad.nombre };
  }

  async remove(jugadorId: number, habilidadId: number): Promise<{ message: string }> {
    const found = await this.repo.findOne({ where: { jugadorId, habilidadId } });
    if (!found) throw new NotFoundException('Asociación de habilidad y jugador no encontrada');
    await this.repo.remove(found);
    return { message: 'Habilidad retirada del jugador exitosamente' };
  }

  async findByJugador(jugadorId: number) {
    const list = await this.repo.find({
      where: { jugadorId },
      relations: { jugador: true, habilidad: true },
    });
    return list.map((h) => ({
      jugadorId: Number(h.jugadorId),
      jugadorNombre: h.jugador?.nombre,
      habilidadId: Number(h.habilidadId),
      habilidadNombre: h.habilidad?.nombre,
      habilidad: h.habilidad ? { id: Number(h.habilidad.id), nombre: h.habilidad.nombre, descripcion: h.habilidad.descripcion } : undefined,
    }));
  }

  async findByHabilidad(habilidadId: number) {
    const list = await this.repo.find({
      where: { habilidadId },
      relations: { jugador: true, habilidad: true },
    });
    return list.map((h) => ({
      jugadorId: Number(h.jugadorId),
      jugadorNombre: h.jugador?.nombre,
      habilidadId: Number(h.habilidadId),
      habilidadNombre: h.habilidad?.nombre,
    }));
  }
}
