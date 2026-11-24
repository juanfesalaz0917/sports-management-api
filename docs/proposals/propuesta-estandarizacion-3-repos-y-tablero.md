# Propuesta Técnica: Rama `feature/solorza`, Permisos `ms_security`, Paginación Base 0 y Tablero en Vivo Coherente

**Fecha:** 23 de Noviembre de 2026  
**Estado:** PENDIENTE DE APROBACIÓN DEL USUARIO  
**Alcance:** `mostro-sport-backend` · `sports-management-api` · `mostro-sport-frontend`  
**Gobernanza:** Máximo 150 líneas por archivo | Cero borrado de código del equipo (`origin/juanfe` / `main`)  

---

## 1. Creación de Rama `feature/solorza` e Integración Segura
- Crear la rama `feature/solorza` en los **3 repositorios**.
- Preservar intacto el trabajo del equipo presente en `main` y `origin/juanfe` (módulos de A, `shared/pagination.ts`, `Pagination.tsx`, informes en `docs/api/`, cambios locales de `mostro-sport-backend`).
- En `mostro-sport-frontend` y `sports-management-api`, integrar las utilidades compartidas del equipo en `feature/solorza` sin eliminar ningún módulo ni archivo ajeno.

---

## 2. Separación de Permisos de Negocio en `mostro-sport-backend` (`ms_security`)
- **Diagnóstico:** `DatabaseSeeder.java` solo siembra permisos propios de seguridad (`/api/users`, `/api/roles`, etc.). `PermissionService.hasPermission` normaliza IDs numéricos a `{id}` y exige coincidencia exacta `(method, url)`. Sin permisos `/api/v1/...`, el negocio devuelve `403` cuando `DEV_SECURITY_BYPASS=false`.
- **Propuesta:**
  1. Mantener `DatabaseSeeder.java` limpio solo con seguridad.
  2. Crear `BusinessPermissionsSeeder.java` (clase independiente en `com.backend.ms_security.config`, < 150 líneas por archivo/helper) para sembrar los permisos de negocio (`/api/v1/...`, `model = "negocio"`), incluyendo los endpoints nuevos de Participante B:
     - `GET /api/v1/fases/{id}/partidos`
     - `PUT /api/v1/partidos/{id}/resultado`
     - `GET /api/v1/apuestas/mis-apuestas`
     - `POST /api/v1/apuestas/{id}/cancelar`
  3. Asignar permisos completos a `ADMIN` (y `AFICIONADO` para consultas/boletos/apuestas/favoritos/métodos propios).
  4. En `mostro-sport-frontend` (`sportsHttpClient.ts`), mantener el envío del JWT y enviar `x-bypass-security` solo cuando no exista sesión activa.

---

## 3. Estandarización de Paginación Base 0 (Solo Módulos de Persona B)
- **Estándar del equipo:** `PageQueryDto` (`page = 0`, `size = 10`) y `PageResponseDto` (`{ content, totalElements, page, size }`) en backend; `FIRST_PAGE = 0`, `buildQuery`, `asArray` y `Pagination.tsx` en frontend.
- **Propuesta (solo Persona B):**
  - **Backend:** Aplicar `PageQueryDto` + `toPage` en `GET /api/v1/partidos`, `GET /api/v1/apuestas`, `GET /api/v1/aficionados`, `GET /api/v1/partidos/:id/boletos`, `GET /api/v1/escenarios/:id/localidades`, `GET /api/v1/pelotas`.
  - **Frontend:** Actualizar servicios y vistas de B (`PartidosListPage`, `ApuestasListPage`, `BoletosListPage`, etc.) para iniciar en `FIRST_PAGE = 0`, consumir `{ content, totalElements }` con `asArray` y renderizar `Pagination.tsx`.

---

## 4. Pulido Coherente del Tablero en Vivo (`PizarraCampoPage`)
Para que la pizarra funcione de extremo a extremo con datos reales del backend y el simulador:
1. **Plantillas y Marcador Reales:** Consultar jugadores de Local y Visitante (`GET /equipos/:id/jugadores`) y anotaciones reales (`GET /partidos/:id/anotaciones`) para calcular el marcador por equipo sin heurísticas arbitrarias.
2. **Coordenadas Normalizadas (`0.0..1.0`):** Enviar lotes a `POST /partidos/:id/posiciones` en rango `0.0..1.0` (contrato oficial con C) y escalar al leer `GET /partidos/:id/posiciones/ultimas` (`0.0..1.0` → `0%..100%`).
3. **Modos Coherentes:**
   - **En Vivo (Polling Backend):** actualiza posiciones y anotaciones cada 2s desde la API.
   - **Simulador:** genera movimiento táctico, remates y sincroniza con el backend.
   - Respetar el estado real del partido (`PROGRAMADO`, `EN_CURSO`, `FINALIZADO`).
4. **Límite de 150 líneas:** Mantener todos los archivos creados y modificados estrictamente debajo de 150 líneas.

---

> [!IMPORTANT]
> **Pausa de Gobernanza (Regla 2.2):** Confírmame si apruebas esta propuesta para crear la rama `feature/solorza` en los 3 repositorios y ejecutar los cambios.
