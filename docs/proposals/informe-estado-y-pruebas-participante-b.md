# Informe de Estado y Pruebas (v2, tras correcciones): Participante B

**Fecha:** 23 de Noviembre de 2026
**Leyenda:** 🟢 PERFECTO (listo y probado) · 🟡 PASABLE (funciona, con salvedades) · 🔴 CRÍTICO

## 1. Veredicto Global: 🟢 SIN CRÍTICOS (2 salvedades pasables)

| Área | Antes | Ahora |
| :--- | :---: | :---: |
| Compilación backend y frontend | 🟢 | 🟢 |
| Regla de 150 líneas (0 violaciones en `src/` de ambos proyectos) | 🟢 | 🟢 |
| Liquidación de apuestas | 🔴 | 🟢 |
| Validación al apostar y al cancelar | 🟡 | 🟢 |
| Contrato `GET /apuestas/mis-apuestas` | 🟡 | 🟢 (por query, ver 3) |
| Cuota y destinatarios de notificaciones | 🟡 | 🟢 configurables |
| Seguridad de endpoints | 🟡 sin verificar | 🟢 guard global |
| Marcador del tablero | 🟡 heurística | 🟢 separado y rotulado |
| Persistencia de posiciones del tablero | 🟡 | 🟡 en memoria, acotada |
| Cobertura de pruebas | 🟡 13 | 🟢 37 pruebas |

## 2. Correcciones aplicadas

| # | Hallazgo | Corrección | Archivos |
| :-: | :--- | :--- | :--- |
| 1 | 🔴 Todas las apuestas pasaban a `GANADA` si había ganador | La apuesta ahora guarda el **equipo elegido** (`id_equipo_seleccionado`); gana solo si coincide con el ganador. Empate, sin equipo o sin ganador ⇒ `ANULADA` | `liquidacion.util.ts`, `apuesta.entity.ts`, `partidos.service.ts` |
| 1b | Bug adicional: se buscaban apuestas `PENDIENTE` pero se crean como `REGISTRADA`, por lo que **nunca se liquidaba nada** | Se liquidan `REGISTRADA` y `PENDIENTE` | `partidos.service.ts` |
| 1c | Finalizar dos veces / ganador ajeno al partido | `409` si ya está FINALIZADO/CANCELADO; `400` si el ganador no participa | `partidos.service.ts` |
| 2 | Cancelar y apostar sin validar estado | Solo se apuesta/cancela con partido `PROGRAMADO`; el equipo debe jugar ese partido; no se cancela una apuesta ya liquidada | `apuesta.validator.ts` |
| 3 | Faltaba `mis-apuestas` | `GET /api/v1/apuestas/mis-apuestas?aficionadoId=` | `apuestas.controller.ts` |
| 4 | Cuota 1.85 y correo fijos | Cuota por variable `CUOTA_BASE`; destinatarios por `NOTIF_DESTINATARIOS` | `apuestas.service.ts`, `notificaciones.client.ts` |
| 5 | Posiciones en memoria sin límite | Tope de 500 registros por partido | `partido-posiciones.service.ts` |
| 6 | Marcador del tablero inferido con `id_jugador <= 5` | Marcador simulado 0-0 rotulado "Simulación · Goles oficiales: N" | `pizarraService.ts`, `TableroMarcadorVivo.tsx` |
| 8 | Guards sin verificar | Verificado: `SecurityGuard` registrado como `APP_GUARD` global en `app.module.ts` (valida contra `ms_security`) | — |
| — | Frontend de apuestas | Selector de equipo (`SelectorEquipoApuesta.tsx`), solo partidos `PROGRAMADO`, estados `REGISTRADA/ANULADA` | `NuevaApuestaModal.tsx`, `apuestaModels.ts` |
| — | `PizarraCampoPage` a 146 líneas | Lógica extraída a `usePizarraSimulacion.ts`; añade estados de error y vacío | `PizarraCampoPage.tsx` |

## 3. Pruebas (resultados reales)

| Suite | Resultado |
| :--- | :---: |
| Backend Jest: 5 suites | **28/28 ✅** |
| Frontend Vitest: 2 archivos | **9/9 ✅** |
| E2E real contra MySQL (`torneos_deportivos`, 11 escenarios de Persona B) | **11/11 ✅** |
| `nest build` | ✅ 0 errores |
| `tsc -b && vite build` | ✅ 0 errores |
| Archivos > 150 líneas (backend y frontend) | **0** |
| Postman JSON válido | ✅ |

Cobertura nueva: regla de liquidación (ganada/perdida/empate/sin equipo/ids string/lote mixto), `finalizarPartido` (liquida por equipo, estados `REGISTRADA`+`PENDIENTE`, doble finalización, ganador ajeno, inexistente), `ApuestaValidator` (partido iniciado, equipo ajeno, pago ajeno, cancelación), cuota configurable, rutas HTTP, simulador y servicio del tablero.

```
cd sports-management-api/backend && npm test
cd mostro-sport-frontend && npm test
```

## 4. Acciones requeridas antes de desplegar

> [!IMPORTANT]
> `synchronize` está en `false`: **ejecuta** `docs/database/migracion-apuesta-equipo-seleccionado.sql` en la base de datos; sin la columna `id_equipo_seleccionado` las consultas de apuestas fallarán.

- Las apuestas existentes quedan sin equipo y se **anulan (reembolso)** al liquidar. `seed-db.js` inserta apuestas sin equipo (se anularían); `test-e2e-api.js` y Postman ya envían `equipoId`.
- `POST /apuestas` ahora **exige** `equipoId` (alias `id_equipo`). Cambio de contrato: avisa a quien consuma esta API.

## 5. Salvedades restantes (🟡)
1. **Posiciones del tablero**: siguen en memoria (acotadas); se pierden al reiniciar. Persistirlas requiere una tabla nueva.
2. **`mis-apuestas`** recibe `aficionadoId` por query: el guard no expone el usuario autenticado. Con contexto JWT debería tomarse del token.
3. El movimiento del tablero sigue siendo simulado en el cliente.
4. La corrida E2E real probó los 11 flujos de Persona B contra MySQL usando `DEV_SECURITY_BYPASS=true` (`x-bypass-security: true`). La validación de tokens JWT reales contra `ms_security` depende de que ese microservicio externo esté levantado.
