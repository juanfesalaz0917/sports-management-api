import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosicionEspacial } from './entities/posicion-espacial.entity';
import { PosicionMapper } from './mappers/posicion.mapper';
import { PosicionesEspacialesController } from './posiciones-espaciales.controller';
import { PosicionesEspacialesService } from './posiciones-espaciales.service';

@Module({
  imports: [TypeOrmModule.forFeature([PosicionEspacial])],
  controllers: [PosicionesEspacialesController],
  providers: [PosicionesEspacialesService, PosicionMapper],
  exports: [TypeOrmModule, PosicionesEspacialesService],
})
export class PosicionesEspacialesModule {}
