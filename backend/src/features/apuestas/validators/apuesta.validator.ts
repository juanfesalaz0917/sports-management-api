import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApuestaDto } from '../dto/create-apuesta.dto';
import { Apuesta } from '../entities/apuesta.entity';
import { ESTADOS_LIQUIDABLES } from '../liquidacion/liquidacion.util';
import { Aficionado } from '../../aficionados/entities/aficionado.entity';
import { MetodoPagoAficionado } from '../../metodos-pago-aficionado/entities/metodo-pago-aficionado.entity';
import { Partido } from '../../partidos/entities/partido.entity';
import { PartidoEquipo } from '../../partidos/entities/partido-equipo.entity';

@Injectable()
export class ApuestaValidator {
  constructor(
    @InjectRepository(Aficionado) private readonly aficionadoRepo: Repository<Aficionado>,
    @InjectRepository(Partido) private readonly partidoRepo: Repository<Partido>,
    @InjectRepository(MetodoPagoAficionado) private readonly mpRepo: Repository<MetodoPagoAficionado>,
    @InjectRepository(PartidoEquipo) private readonly peRepo: Repository<PartidoEquipo>,
  ) {}

  async buscarPartido(id: number): Promise<Partido> {
    const partido = await this.partidoRepo.findOne({ where: { id } });
    if (!partido) throw new NotFoundException(`Partido ${id} no existe`);
    return partido;
  }

  async validarCreacion(dto: CreateApuestaDto): Promise<Aficionado> {
    const aficionado = await this.aficionadoRepo.findOne({ where: { id: dto.aficionadoId } });
    if (!aficionado) throw new NotFoundException(`Aficionado ${dto.aficionadoId} no existe`);

    const partido = await this.buscarPartido(dto.partidoId);
    if (partido.estado !== 'PROGRAMADO') {
      throw new BadRequestException('Solo se puede apostar en partidos que aún no han iniciado');
    }

    const participa = await this.peRepo.findOne({ where: { partidoId: dto.partidoId, equipoId: dto.equipoId } });
    if (!participa) throw new BadRequestException('El equipo elegido no participa en el partido');

    const mp = await this.mpRepo.findOne({
      where: { id: dto.metodoAficionadoId, aficionadoId: dto.aficionadoId },
      relations: { metodoPago: true },
    });
    if (!mp) throw new BadRequestException('El método de pago no pertenece al aficionado');
    if (mp.activo === false || mp.metodoPago?.activo === false) throw new BadRequestException('El método de pago no está activo');
    return aficionado;
  }

  validarCancelable(apuesta: Apuesta): void {
    if (!apuesta.estado || !ESTADOS_LIQUIDABLES.includes(apuesta.estado)) {
      throw new ConflictException(`La apuesta ${apuesta.id} está en estado ${apuesta.estado} y no puede cancelarse`);
    }
    if (apuesta.partido?.estado !== 'PROGRAMADO') {
      throw new BadRequestException('No se puede cancelar: el partido ya inició o terminó');
    }
  }
}
