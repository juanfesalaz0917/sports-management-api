import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetodoPago } from './entities/metodo-pago.entity';
import { MetodosPagoController } from './metodos-pago.controller';
import { MetodosPagoService } from './metodos-pago.service';
import { MetodoPagoAficionado } from '../metodos-pago-aficionado/entities/metodo-pago-aficionado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MetodoPago, MetodoPagoAficionado])],
  controllers: [MetodosPagoController],
  providers: [MetodosPagoService],
  exports: [MetodosPagoService, TypeOrmModule],
})
export class MetodosPagoModule {}
