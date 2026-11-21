import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class MetodoPagoValidator {
  validar(tipoNombre: string, datosCuenta: string): void {
    if (!datosCuenta || datosCuenta.trim().length === 0) {
      throw new BadRequestException('Los datos del método de pago no pueden estar vacíos');
    }

    if (tipoNombre.includes('TARJETA') && datosCuenta.length < 4) {
      throw new BadRequestException('Para tarjetas debe especificar al menos los últimos 4 dígitos');
    }

    if (tipoNombre.includes('PSE') && !datosCuenta.includes('@') && datosCuenta.length < 6) {
      throw new BadRequestException('Para PSE debe registrar correo o cuenta bancaria válida');
    }
  }
}
