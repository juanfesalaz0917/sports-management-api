# Informe Técnico: Estandarización `feature/solorza`, Permisos `ms_security`, Paginación Base 0 y Tablero en Vivo

**Fecha:** 23 de Noviembre de 2026  
**Rama activa en los 3 repositorios:** `feature/solorza`  
**Estado:** COMPLETADO Y VERIFICADO  

---

## 1. Ramas e Integración Segura
- Se creó la rama `feature/solorza` en:
  - `mostro-sport-backend` (conservando intactos los cambios locales del usuario en curso).
  - `sports-management-api` (incorporando los informes de permisos/endpoints de `origin/juanfe`).
  - `mostro-sport-frontend` (integrando `shared/`, `Pagination.tsx` y los módulos del Participante A desde `origin/juanfe` sin eliminar nada).

## 2. Permisos de Negocio Separados en `mostro-sport-backend` (`ms_security`)
- Se mantuvo `DatabaseSeeder.java` intacto solo para seguridad (`/api/users`, `/api/roles`, etc.).
- Se creó el seeder independiente:
  - `BusinessPermissionDef.java` (7 líneas)
  - `BusinessCorePermissions.java` (97 líneas)
  - `BusinessOperationsPermissions.java` (90 líneas — incluye los endpoints nuevos de B: `GET /api/v1/fases/{id}/partidos`, `PUT /api/v1/partidos/{id}/resultado`, `GET /api/v1/apuestas/mis-apuestas`, `POST /api/v1/apuestas/{id}/cancelar`)
  - `BusinessPermissionsSeeder.java` (84 líneas — `@Order(2)`, siembra con `model = "negocio"` para `ADMIN` y `AFICIONADO`)
- En `mostro-sport-frontend/src/core/http/sportsHttpClient.ts`, `x-bypass-security` solo se envía cuando no existe `token` JWT en sesión.

## 3. Paginación Base 0 (`page=0`) en Persona B
- **Backend (`sports-management-api`):** `GET /api/v1/partidos`, `GET /api/v1/apuestas`, `GET /api/v1/aficionados` y `GET /api/v1/pelotas` ahora usan `PageQueryDto` (`page = 0`, `size = 10`) y `toPage` → `{ content, totalElements, page, size }`.
- **Frontend (`mostro-sport-frontend`):** `partidosService.ts`, `PartidosListPage.tsx`, `apuestasService.ts` y `ApuestasPage.tsx` utilizan `FIRST_PAGE = 0`, `asArray`, `buildQuery` y `<Pagination />`, además de habilitar el botón Cancelar para apuestas en estado `REGISTRADA`.

## 4. Tablero en Vivo Coherente (`pizarra/`)
- `pizarraService.ts` carga plantillas reales de ambos equipos (`GET /equipos/:id/jugadores`), anotaciones reales (`GET /partidos/:id/anotaciones`) y posiciones espaciales (`GET /partidos/:id/posiciones/ultimas`).
- Escalado bidireccional estricto `0.0..1.0` ↔ `0%..100%` (`deApiAPorcentaje` / `dePorcentajeAApi`).
- `usePizarraSimulacion.ts` separa modo **En Vivo (API)** (polling cada 2.5s) y modo **Simulador** (envía lotes normalizados `0.0..1.0` al backend y respeta partidos `FINALIZADO`/`CANCELADO`).

## 5. Resultados de Verificación
- **`mostro-sport-backend` (`mvnw.cmd test-compile`):** ✅ 0 errores.
- **`sports-management-api`:** `nest build` ✅ 0 errores · Jest **28/28 PASS** · E2E real contra MySQL **12/12 PASS** (incluyendo paginación `page=0`).
- **`mostro-sport-frontend`:** `tsc -b && vite build` ✅ 0 errores · Vitest **9/9 PASS**.
- **Regla de 150 líneas:** **0 violaciones** en todos los archivos creados y modificados.
