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

/**
 * Cliente del microservicio de notificaciones (Flask).
 * Contrato real: POST {MS_NOTIFICATIONS}/send-email  { to, subject, message }
 * Se envia un correo por destinatario. Nunca lanza excepcion: una falla de
 * notificacion no debe revertir la operacion principal.
 */
@Injectable()
export class NotificacionesClient {
  private readonly logger = new Logger(NotificacionesClient.name);

  constructor(private readonly configService: ConfigService) {}

  async enviarNotificacion(payload: NotificacionPayload): Promise<boolean> {
    const baseUrl = this.configService.get<string>('MS_NOTIFICATIONS');
    if (!baseUrl) {
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
      await axios.post(`${baseUrl}/api/v1/notificaciones`, { ...payload, destinatarios }, { timeout: 3000 });
      this.logger.log(`Notificación enviada: [${payload.tipo}] a ${destinatarios.length} destinatarios`);
      return true;
    } catch (error) {
      this.logger.warn(`Fallo al enviar notificación externa: ${(error as Error).message}`);
      return false;
    }
    const resultados = await Promise.all(
      payload.destinatarios.map(async (to) => {
        try {
          await axios.post(
            `${baseUrl}/send-email`,
            { to, subject: payload.asunto, message: payload.mensaje },
            { timeout: 5000 },
          );
          return true;
        } catch (error) {
          this.logger.warn(`Fallo al enviar notificación [${payload.tipo}] a ${to}: ${(error as Error).message}`);
          return false;
        }
      }),
    );

    const ok = resultados.filter(Boolean).length;
    if (ok > 0) this.logger.log(`Notificación enviada: [${payload.tipo}] ${ok}/${resultados.length} destinatarios`);
    return ok > 0;
  }
}
