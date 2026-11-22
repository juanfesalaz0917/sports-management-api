import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aficionado } from './entities/aficionado.entity';
import { AficionadoMapper } from './mappers/aficionado.mapper';
import { AficionadosController } from './aficionados.controller';
import { AficionadosService } from './aficionados.service';

@Module({
  imports: [TypeOrmModule.forFeature([Aficionado])],
  controllers: [AficionadosController],
  providers: [AficionadosService, AficionadoMapper],
  exports: [TypeOrmModule, AficionadosService],
})
export class AficionadosModule {}
