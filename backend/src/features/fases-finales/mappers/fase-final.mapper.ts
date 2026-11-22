import { Injectable } from '@nestjs/common';
import { FaseFinalResponseDto } from '../dto/fase-final.dto';
import { FaseFinal } from '../entities/fase-final.entity';

@Injectable()
export class FaseFinalMapper {
  toResponseDto(entity: FaseFinal): FaseFinalResponseDto {
    return {
      faseId: Number(entity.faseId),
      faseNombre: entity.fase?.nombre,
      torneoId: Number(entity.fase?.torneoId),
      modalidad: entity.modalidad ?? undefined,
    };
  }
}
