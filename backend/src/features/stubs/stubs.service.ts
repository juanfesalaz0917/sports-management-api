import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelota } from '../pelotas/entities/pelota.entity';
import { Deporte } from './entities/deporte.entity';
import { Equipo } from './entities/equipo.entity';
import { Escenario } from './entities/escenario.entity';
import { Fase } from './entities/fase.entity';
import { Habilidad } from './entities/habilidad.entity';
import { Jugador } from './entities/jugador.entity';
import { MetodoPago } from './entities/metodo-pago.entity';
import { Torneo } from './entities/torneo.entity';

@Injectable()
export class StubsService {
  constructor(
    @InjectRepository(Deporte) private readonly deporteRepo: Repository<Deporte>,
    @InjectRepository(Equipo) private readonly equipoRepo: Repository<Equipo>,
    @InjectRepository(Torneo) private readonly torneoRepo: Repository<Torneo>,
    @InjectRepository(Fase) private readonly faseRepo: Repository<Fase>,
    @InjectRepository(Escenario) private readonly escenarioRepo: Repository<Escenario>,
    @InjectRepository(Jugador) private readonly jugadorRepo: Repository<Jugador>,
    @InjectRepository(Habilidad) private readonly habilidadRepo: Repository<Habilidad>,
    @InjectRepository(MetodoPago) private readonly metodoPagoRepo: Repository<MetodoPago>,
    @InjectRepository(Pelota) private readonly pelotaRepo: Repository<Pelota>,
  ) {}

  async getTorneos() {
    const list = await this.torneoRepo.find({ order: { id: 'ASC' } });
    return list.map((t) => ({ id: Number(t.id), id_torneo: Number(t.id), nombre: t.nombre }));
  }

  async getFases(torneoId: number) {
    const list = await this.faseRepo.find({ where: { torneoId }, order: { orden: 'ASC', id: 'ASC' } });
    return list.map((f) => ({ id: Number(f.id), id_fase: Number(f.id), nombre: f.nombre, tipo: f.tipo }));
  }

  async getEscenarios() {
    const list = await this.escenarioRepo.find({ order: { id: 'ASC' } });
    return list.map((e) => ({ id: Number(e.id), id_escenario: Number(e.id), nombre: e.nombre, direccion: e.direccion }));
  }

  async getEquipos() {
    const list = await this.equipoRepo.find({ order: { id: 'ASC' } });
    return list.map((eq) => ({ id: Number(eq.id), id_equipo: Number(eq.id), nombre: eq.nombre }));
  }

  async getJugadores() {
    const list = await this.jugadorRepo.find({ order: { id: 'ASC' } });
    return list.map((j) => ({
      id: Number(j.id),
      id_jugador: Number(j.id),
      nombre: j.nombre,
      apellido: j.apellido,
      posicionId: j.posicionId,
    }));
  }

  async getPelotas() {
    const list = await this.pelotaRepo.find({ order: { id: 'ASC' } });
    return list.map((p) => ({ id: Number(p.id), id_pelota: Number(p.id), referencia: p.referencia, marca: p.marca }));
  }

  async getHabilidades() {
    const list = await this.habilidadRepo.find({ order: { id: 'ASC' } });
    return list.map((h) => ({ id: Number(h.id), id_habilidad: Number(h.id), nombre: h.nombre, descripcion: h.descripcion }));
  }

  async getMetodosPago() {
    const list = await this.metodoPagoRepo.find({ order: { id: 'ASC' } });
    return list.map((m) => ({ id: Number(m.id), id_metodo_pago: Number(m.id), nombre: m.nombre, descripcion: m.descripcion }));
  }

  async seedDemoData() {
    let dep = await this.deporteRepo.findOne({ where: { nombre: 'Fútbol' } });
    if (!dep) dep = await this.deporteRepo.save({ nombre: 'Fútbol', descripcion: 'Fútbol 11 profesional' });

    let t1 = await this.equipoRepo.findOne({ where: { nombre: 'Águilas FC' } });
    if (!t1) t1 = await this.equipoRepo.save({ nombre: 'Águilas FC', fechaCreacion: '2010-01-15' });

    let t2 = await this.equipoRepo.findOne({ where: { nombre: 'Tigres FC' } });
    if (!t2) t2 = await this.equipoRepo.save({ nombre: 'Tigres FC', fechaCreacion: '2012-05-20' });

    let torneo = await this.torneoRepo.findOne({ where: { nombre: 'Copa Nacional 2026' } });
    if (!torneo) torneo = await this.torneoRepo.save({ nombre: 'Copa Nacional 2026', deporteId: dep.id, fechaInicio: '2026-06-01', fechaFin: '2026-07-01' });

    let fase = await this.faseRepo.findOne({ where: { torneoId: torneo.id } });
    if (!fase) fase = await this.faseRepo.save({ nombre: 'Fase de Grupos', tipo: 'GRUPO', torneoId: torneo.id });

    let esc = await this.escenarioRepo.findOne({ where: { nombre: 'Estadio Metropolitano' } });
    if (!esc) esc = await this.escenarioRepo.save({ nombre: 'Estadio Metropolitano', direccion: 'Calle 100 # 45-12' });

    let j1 = await this.jugadorRepo.findOne({ where: { nombre: 'Carlos' } });
    if (!j1) j1 = await this.jugadorRepo.save({ nombre: 'Carlos', apellido: 'Valderrama', fechaNacimiento: '1990-09-02' });

    let j2 = await this.jugadorRepo.findOne({ where: { nombre: 'Radamel' } });
    if (!j2) j2 = await this.jugadorRepo.save({ nombre: 'Radamel', apellido: 'Falcao', fechaNacimiento: '1986-02-10' });

    let hab = await this.habilidadRepo.findOne({ where: { nombre: 'Velocidad Punta' } });
    if (!hab) hab = await this.habilidadRepo.save({ nombre: 'Velocidad Punta', descripcion: 'Aceleración rápida' });

    let mp = await this.metodoPagoRepo.findOne({ where: { nombre: 'TARJETA_CREDITO' } });
    if (!mp) mp = await this.metodoPagoRepo.save({ nombre: 'TARJETA_CREDITO', descripcion: 'Tarjeta de crédito Visa o Mastercard' });

    return { mensaje: 'Datos de prueba sembrados exitosamente', deporte: dep, equipo1: t1, equipo2: t2, torneo, fase, escenario: esc, j1, j2, habilidad: hab, metodoPago: mp };
  }
}
