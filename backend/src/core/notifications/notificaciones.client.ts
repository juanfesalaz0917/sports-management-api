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
