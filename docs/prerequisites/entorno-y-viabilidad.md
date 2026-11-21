# Informe de Prerrequisitos y Viabilidad de Entorno

## 1. Entorno de Ejecución Local
- **Sistema Operativo**: Windows 11 (arquitectura x64).
- **Entorno de Node.js**: Node.js LTS activo con npm.
- **Base de Datos**: MySQL Server local (puerto 3306).
  - Base de datos requerida: `sports_management_db` (o configurable en `.env`).
  - Usuario: `root` o credenciales dedicadas de desarrollo.
- **Framework**: NestJS v12.
- **ORM**: TypeORM v0.3 con driver `mysql2`.

## 2. Dependencias Obligatorias del Ecosistema
Según lo dictado en `tutoriales/0_0_Configuracion_proyecto.md` y `NestJS.md`:
- `@nestjs/typeorm` y `typeorm`
- `mysql2`
- `@nestjs/config`
- `class-validator` y `class-transformer`
- `@nestjs/mapped-types`
- `axios` (para llamadas nativas a microservicios externos)
- `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io` (para seguimiento en vivo y notificaciones en tiempo real)

## 3. Viabilidad de Integración con Microservicios
- **Microservicio de Seguridad**:
  - Variable de entorno `MS_SECURITY=http://localhost:8080`.
  - Contrato: `POST /api/internal/security/permissions-validation` con Bearer token.
  - Modo desarrollo: `SecurityGuard` admitirá modo permisivo configurable para pruebas de Postman locales cuando el microservicio de seguridad no esté levantado.
- **Microservicio de Notificaciones**:
  - Variable de entorno `MS_NOTIFICATIONS=http://localhost:8081`.
  - Mecanismo de envío asíncrono no bloqueante con manejo de excepciones (try/catch + logger).
