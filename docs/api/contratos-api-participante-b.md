# Contratos de API REST (Participante B)

Prefijo global: `/api/v1`
Formato de respuesta estándar: JSON en camelCase

## 1. Endpoints de Partidos y Seguimiento
- `POST /api/v1/partidos`: Crear partido (valida equipos diferentes, fases, escenario).
- `GET /api/v1/partidos`: Listar partidos con filtros (`faseId`, `estado`, paginación).
- `GET /api/v1/partidos/:id`: Detalle del partido con equipos y marcador.
- `PATCH /api/v1/partidos/:id/estado`: Cambiar estado (`EN_CURSO`, `CANCELADO`).
- `PUT /api/v1/partidos/:id/resultado`: Registrar marcador final y disparar liquidación.
- `POST /api/v1/partidos/:id/anotaciones`: Registrar anotación de un jugador.
- `GET /api/v1/partidos/:id/anotaciones`: Listar anotaciones del partido.
- `POST /api/v1/partidos/:id/posiciones`: Registrar posiciones (acepta array de lote).
- `GET /api/v1/partidos/:id/posiciones/ultimas`: Últimas posiciones para refrescar pizarra.

## 2. Endpoints de Aficionados y Boletos
- `POST /api/v1/aficionados`: Registro de aficionado.
- `GET /api/v1/aficionados/:id`: Consultar perfil de aficionado.
- `POST /api/v1/aficionados/:id/equipos/:equipoId`: Agregar equipo favorito.
- `DELETE /api/v1/aficionados/:id/equipos/:equipoId`: Quitar equipo favorito.
- `POST /api/v1/aficionados/:id/metodos-pago`: Registrar método de pago del aficionado.
- `GET /api/v1/aficionados/:id/metodos-pago`: Listar métodos de pago activos.
- `DELETE /api/v1/aficionados/:id/metodos-pago/:mpId`: Desactivar (soft-delete).
- `POST /api/v1/boletos`: Emitir boleto para un partido y localidad.
- `GET /api/v1/partidos/:id/boletos`: Listar boletos vendidos de un partido.

## 3. Endpoints de Apuestas
- `POST /api/v1/apuestas`: Realizar apuesta (valida partido no iniciado, congela cuota).
- `GET /api/v1/apuestas/mis-apuestas`: Consultar apuestas del aficionado autenticado.
- `GET /api/v1/partidos/:id/apuestas`: Consultar apuestas del partido (solo admin).
- `POST /api/v1/apuestas/:id/cancelar`: Cancelar apuesta si el partido no ha iniciado.

## 4. Endpoints de Habilidades Jugador
- `POST /api/v1/jugadores/:id/habilidades/:habilidadId`: Asignar habilidad.
- `GET /api/v1/jugadores/:id/habilidades`: Listar habilidades del jugador.
- `DELETE /api/v1/jugadores/:id/habilidades/:habilidadId`: Retirar habilidad.
