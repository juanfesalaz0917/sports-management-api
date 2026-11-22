import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pelota } from './entities/pelota.entity';
import { PelotaMapper } from './mappers/pelota.mapper';
import { PelotasController } from './pelotas.controller';
import { PelotasService } from './pelotas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pelota])],
  controllers: [PelotasController],
  providers: [PelotasService, PelotaMapper],
  exports: [TypeOrmModule, PelotasService],
})
export class PelotasModule {}
