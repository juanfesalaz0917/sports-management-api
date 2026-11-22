import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { EquipoDeporte } from '../../equipos-deportes/entities/equipo-deporte.entity';
import { Torneo } from '../../torneos/entities/torneo.entity';
import { Deporte } from '../entities/deporte.entity';

@Injectable()
export class DeporteValidator {
  constructor(
    @InjectRepository(Deporte)
    private readonly repo: Repository<Deporte>,
    @InjectRepository(EquipoDeporte)
    private readonly equipoDeporteRepo: Repository<EquipoDeporte>,
    @InjectRepository(Torneo)
    private readonly torneoRepo: Repository<Torneo>,
  ) {}

  async validarNombreUnico(
    nombre: string,
    padreId: number | null,
    excluirId?: number,
  ): Promise<void> {
    const existentes = await this.repo.find({
      where: {
        nombre: nombre.trim(),
        deportePadreId: padreId === null ? IsNull() : padreId,
      },
    });
    if (existentes.some((d) => Number(d.id) !== excluirId)) {
      throw new ConflictException(
        padreId === null
          ? `Ya existe un deporte "${nombre}"`
          : `Ya existe un subdeporte "${nombre}" dentro del deporte ${padreId}`,
      );
    }
  }

  async validarPadre(id: number, padreId: number): Promise<void> {
    if (padreId === id) {
      throw new BadRequestException('Un deporte no puede ser su propio padre');
    }
    let actual: Deporte | null = await this.repo.findOne({ where: { id: padreId } });
    if (!actual) throw new NotFoundException(`Deporte padre ${padreId} no existe`);
    const visitados = new Set<number>();
    while (actual && actual.deportePadreId != null && !visitados.has(Number(actual.id))) {
      visitados.add(Number(actual.id));
      if (Number(actual.deportePadreId) === id) {
        throw new BadRequestException(
          'El deporte padre elegido es un subdeporte de este deporte (ciclo en la jerarquía)',
        );
      }
      actual = await this.repo.findOne({ where: { id: Number(actual.deportePadreId) } });
    }
  }

  async validarSinAsociaciones(id: number, accion: string): Promise<void> {
    const [subdeportes, equipos, torneos] = await Promise.all([
      this.repo.count({ where: { deportePadreId: id } }),
      this.equipoDeporteRepo.count({ where: { deporteId: id } }),
      this.torneoRepo.count({ where: { deporteId: id } }),
    ]);
    const motivos: string[] = [];
    if (subdeportes) motivos.push(`${subdeportes} subdeporte(s)`);
    if (equipos) motivos.push(`${equipos} equipo(s)`);
    if (torneos) motivos.push(`${torneos} torneo(s)`);
    if (motivos.length) {
      throw new ConflictException(
        `No se puede ${accion} el deporte ${id}: tiene ${motivos.join(', ')} asociado(s)`,
      );
    }
  }
}
