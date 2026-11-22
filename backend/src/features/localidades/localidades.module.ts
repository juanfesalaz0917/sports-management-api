import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Localidad } from './entities/localidad.entity';
import { LocalidadMapper } from './mappers/localidad.mapper';
import { LocalidadesController } from './localidades.controller';
import { LocalidadesService } from './localidades.service';
import { Escenario } from '../stubs/entities/escenario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Localidad, Escenario])],
  controllers: [LocalidadesController],
  providers: [LocalidadesService, LocalidadMapper],
  exports: [TypeOrmModule, LocalidadesService],
})
export class LocalidadesModule {}
