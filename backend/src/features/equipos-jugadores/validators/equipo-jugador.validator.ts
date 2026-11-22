import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EquipoJugador } from '../entities/equipo-jugador.entity';

const dia = (f?: string | null): string | null => (f ? f.slice(0, 10) : null);

@Injectable()
export class EquipoJugadorValidator {
  constructor(
    @InjectRepository(EquipoJugador)
    private readonly repo: Repository<EquipoJugador>,
  ) {}

  validarRango(inicio: string | null, fin: string | null): void {
    if (inicio && fin && fin < inicio) {
      throw new BadRequestException('fechaFin no puede ser anterior a fechaInicio');
    }
  }

  async validarSinSolape(
    equipoId: number,
    jugadorId: number,
    inicio: string | null,
    fin: string | null,
    excluirId?: number,
  ): Promise<void> {
    const existentes = await this.repo.find({ where: { equipoId, jugadorId } });
    const solapa = existentes.some((v) => {
      if (excluirId !== undefined && Number(v.id) === excluirId) return false;
      const vi = dia(v.fechaInicio);
      const vf = dia(v.fechaFin);
      const empiezaAntesDeQueTermineElOtro = !vf || !inicio || inicio < vf;
      const elOtroEmpiezaAntesDeQueTermineEste = !fin || !vi || vi < fin;
      return empiezaAntesDeQueTermineElOtro && elOtroEmpiezaAntesDeQueTermineEste;
    });
    if (solapa) {
      throw new ConflictException(
        `El jugador ${jugadorId} ya tiene un vínculo con el equipo ${equipoId} que se solapa con ese periodo`,
      );
    }
  }
}
