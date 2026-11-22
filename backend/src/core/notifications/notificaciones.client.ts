import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface NotificacionPayload {
  tipo: string;
  destinatarios: string[];
  asunto: string;
  mensaje: string;
  datos?: Record<string, any>;
}

@Injectable()
export class NotificacionesClient {
  private readonly logger = new Logger(NotificacionesClient.name);

  constructor(private readonly configService: ConfigService) {}

  async enviarNotificacion(payload: NotificacionPayload): Promise<boolean> {
    const url = this.configService.get<string>('MS_NOTIFICATIONS');
    if (!url) {
      this.logger.warn('MS_NOTIFICATIONS no está configurado, omitiendo llamada');
      return false;
    }

    try {
      await axios.post(`${url}/api/v1/notificaciones`, payload, { timeout: 3000 });
      this.logger.log(`Notificación enviada: [${payload.tipo}] a ${payload.destinatarios.length} destinatarios`);
      return true;
    } catch (error) {
      this.logger.warn(`Fallo al enviar notificación externa: ${(error as Error).message}`);
      return false;
    }
  }
}
