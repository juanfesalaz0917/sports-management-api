import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AficionadoEquipo } from './entities/aficionado-equipo.entity';
import { AficionadosEquiposController } from './aficionados-equipos.controller';
import { AficionadosEquiposService } from './aficionados-equipos.service';
import { Aficionado } from '../aficionados/entities/aficionado.entity';
import { Equipo } from '../stubs/entities/equipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AficionadoEquipo, Aficionado, Equipo])],
  controllers: [AficionadosEquiposController],
  providers: [AficionadosEquiposService],
  exports: [TypeOrmModule, AficionadosEquiposService],
})
export class AficionadosEquiposModule {}
