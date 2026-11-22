import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AficionadoEquipo } from './entities/aficionado-equipo.entity';
import { Aficionado } from '../aficionados/entities/aficionado.entity';
import { Equipo } from '../stubs/entities/equipo.entity';

@Injectable()
export class AficionadosEquiposService {
  constructor(
    @InjectRepository(AficionadoEquipo)
    private readonly repo: Repository<AficionadoEquipo>,
    @InjectRepository(Aficionado)
    private readonly aficionadoRepo: Repository<Aficionado>,
    @InjectRepository(Equipo)
    private readonly equipoRepo: Repository<Equipo>,
  ) {}

  async assign(aficionadoId: number, equipoId: number) {
    const aficionado = await this.aficionadoRepo.findOne({ where: { id: aficionadoId } });
    if (!aficionado) throw new NotFoundException(`Aficionado ${aficionadoId} no encontrado`);

    const equipo = await this.equipoRepo.findOne({ where: { id: equipoId } });
    if (!equipo) throw new NotFoundException(`Equipo ${equipoId} no encontrado`);

    const exists = await this.repo.findOne({ where: { aficionadoId, equipoId } });
    if (exists) throw new ConflictException('El aficionado ya tiene asignado este equipo');

    const entity = this.repo.create({ aficionadoId, equipoId });
    await this.repo.save(entity);
    return { aficionadoId, equipoId, equipoNombre: equipo.nombre };
  }

  async remove(aficionadoId: number, equipoId: number): Promise<{ message: string }> {
    const found = await this.repo.findOne({ where: { aficionadoId, equipoId } });
    if (!found) throw new NotFoundException('Asociación no encontrada');
    await this.repo.remove(found);
    return { message: 'Equipo favorito retirado exitosamente' };
  }

  async findByAficionado(aficionadoId: number) {
    const list = await this.repo.find({
      where: { aficionadoId },
      relations: { equipo: true },
    });
    return list.map((ae) => ({
      aficionadoId: Number(ae.aficionadoId),
      equipoId: Number(ae.equipoId),
      equipoNombre: ae.equipo?.nombre,
    }));
  }
}
