import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Request } from 'express';

interface PermissionValidationResponse {
  allowed: boolean;
}

@Injectable()
export class SecurityGuard implements CanActivate {
  private readonly logger = new Logger(SecurityGuard.name);

  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'http') return true;

    const request = context.switchToHttp().getRequest<Request>();
    const isDevBypass = this.configService.get<string>('DEV_SECURITY_BYPASS') === 'true';
    const bypassHeader = request.headers['x-bypass-security'];

    if (isDevBypass && (bypassHeader === 'true' || !request.headers.authorization)) {
      return true;
    }

    const token = this.extractBearerToken(request.headers.authorization);
    const securityBaseUrl = this.configService.get<string>('MS_SECURITY');

    if (!securityBaseUrl) {
      if (isDevBypass) return true;
      throw new ForbiddenException('Servicio de seguridad no configurado');
    }

    try {
      const response = await axios.post<PermissionValidationResponse>(
        `${securityBaseUrl}/api/internal/security/permissions-validation`,
        {
          url: request.path,
          method: request.method,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 4000,
        },
      );

      if (response.data && response.data.allowed === true) return true;
      throw new ForbiddenException('No tiene permiso para acceder a este recurso');
    } catch (error) {
      if (!isDevBypass && error instanceof ForbiddenException) throw error;
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        this.logger.warn(
          `ms_security respondió ${status ?? error.code} validando ${request.method} ${request.path}`,
        );
        if (!isDevBypass && status === 401) {
          throw new UnauthorizedException('Token inválido o expirado');
        }
      }
      if (isDevBypass) {
        this.logger.warn(`Bypass de seguridad activado debido a falla en ms_security: ${(error as Error).message}`);
        return true;
      }
      throw new ForbiddenException('Permiso denegado por el servicio de seguridad');
    }
  }

  private extractBearerToken(authHeader?: string): string {
    if (!authHeader) throw new UnauthorizedException('Token no proporcionado');
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token no valido (use Bearer <token>)');
    }
    return token;
  }
}
