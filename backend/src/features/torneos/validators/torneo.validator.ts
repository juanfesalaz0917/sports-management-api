import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deporte } from '../../deportes/entities/deporte.entity';
import { Fase } from '../../fases/entities/fase.entity';
import { Inscripcion } from '../../inscripciones/entities/inscripcion.entity';
import { Partido } from '../../partidos/entities/partido.entity';

const dia = (f?: string | null): string | undefined => (f ? f.slice(0, 10) : undefined);

@Injectable()
export class TorneoValidator {
  constructor(
    @InjectRepository(Deporte)
    private readonly deporteRepo: Repository<Deporte>,
    @InjectRepository(Fase)
    private readonly faseRepo: Repository<Fase>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepo: Repository<Inscripcion>,
    @InjectRepository(Partido)
    private readonly partidoRepo: Repository<Partido>,
  ) {}

  async validarDeporte(deporteId: number): Promise<void> {
    const deporte = await this.deporteRepo.findOne({ where: { id: deporteId } });
    if (!deporte) throw new NotFoundException(`Deporte ${deporteId} no existe`);
    if (!deporte.activo) throw new BadRequestException(`El deporte ${deporteId} está inactivo`);
  }

  validarFechas(inicio?: string, fin?: string, cierre?: string): void {
    const i = dia(inicio);
    const f = dia(fin);
    const c = dia(cierre);
    if (i && f && f < i) {
      throw new BadRequestException('fechaFin no puede ser anterior a fechaInicio');
    }
    if (c && i && c > i) {
      throw new BadRequestException('fechaCierreInscripciones no puede ser posterior a fechaInicio');
    }
  }

  async validarSinAsociaciones(id: number): Promise<void> {
    const [fases, partidos, inscripciones] = await Promise.all([
      this.faseRepo.count({ where: { torneoId: id } }),
      this.partidoRepo.count({ where: { torneoId: id } }),
      this.inscripcionRepo.count({ where: { torneoId: id } }),
    ]);
    const motivos: string[] = [];
    if (fases) motivos.push(`${fases} fase(s)`);
    if (partidos) motivos.push(`${partidos} partido(s)`);
    if (inscripciones) motivos.push(`${inscripciones} inscripción(es)`);
    if (motivos.length) {
      throw new ConflictException(
        `No se puede eliminar el torneo ${id}: tiene ${motivos.join(', ')} asociado(s). Puede cancelarlo en su lugar.`,
      );
    }
  }
}
