import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetodoPagoAficionado } from './entities/metodo-pago-aficionado.entity';
import { MetodoPagoAficionadoMapper } from './mappers/metodo-pago-aficionado.mapper';
import { MetodosPagoAficionadoController } from './metodos-pago-aficionado.controller';
import { MetodosPagoAficionadoService } from './metodos-pago-aficionado.service';
import { Aficionado } from '../aficionados/entities/aficionado.entity';
import { MetodoPago } from '../stubs/entities/metodo-pago.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MetodoPagoAficionado, Aficionado, MetodoPago]),
  ],
  controllers: [MetodosPagoAficionadoController],
  providers: [MetodosPagoAficionadoService, MetodoPagoAficionadoMapper],
  exports: [TypeOrmModule, MetodosPagoAficionadoService],
})
export class MetodosPagoAficionadoModule {}
