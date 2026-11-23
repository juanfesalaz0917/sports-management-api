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

    // Si el emisor no indica destinatarios, se usa la lista configurable (NOTIF_DESTINATARIOS=a@x.com,b@y.com)
    const porDefecto = (this.configService.get<string>('NOTIF_DESTINATARIOS') ?? '')
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);
    const destinatarios = payload.destinatarios.length ? payload.destinatarios : porDefecto;
    if (!destinatarios.length) {
      this.logger.warn('Sin destinatarios (defina NOTIF_DESTINATARIOS), omitiendo notificación');
      return false;
    }

    try {
      await axios.post(`${url}/api/v1/notificaciones`, { ...payload, destinatarios }, { timeout: 3000 });
      this.logger.log(`Notificación enviada: [${payload.tipo}] a ${destinatarios.length} destinatarios`);
      return true;
    } catch (error) {
      this.logger.warn(`Fallo al enviar notificación externa: ${(error as Error).message}`);
      return false;
    }
  }
}
