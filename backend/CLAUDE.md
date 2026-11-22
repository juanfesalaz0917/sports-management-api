# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto
6
Microservicio de **negocio** de un sistema de gestión deportiva (equipos, torneos, partidos, aficionados, apuestas). Convive con otros servicios que ya existen y que solo se **integran** (no se desarrollan aquí):

- **Microservicio de seguridad** (puerto distinto): emite el JWT; cada endpoint de negocio debe validar token y rol (`ADMIN_DEPORTIVO`, `AFICIONADO`).
- **Microservicio de notificaciones**: se consume desde negocio (correos/avisos de partidos, anotaciones, resultados, apuestas).
- **Frontend**: existe en un repo/carpeta aparte (`../../frontend`).

El git root es `ms_negocio/`, pero el proyecto NestJS vive en `ms_negocio/backend/` (todos los comandos se ejecutan desde ahí). Nota: `.gitignore` excluye `/context`, `/.claude` y `CLAUDE.md`, así que estos archivos no se versionan.

Quien usa este repo es el **Integrante A** (ver reparto abajo). Idioma del dominio, de la BD y de las rutas: español.

## Comandos

```bash
npm run start:dev      # nest start --watch (puerto: process.env.PORT ?? 3000)
npm run build          # nest build -> dist/
npm run start:prod     # node dist/main
npm run lint           # oxlint src/ test/   (NO es ESLint)
npm run format         # prettier --write src/ y test/
npm test               # jest (unit: *.spec.ts dentro de src/)
npm run test:e2e       # jest --config ./test/jest-e2e.json
npx jest src/path/archivo.spec.ts          # un solo archivo
npx jest -t "nombre del test"              # un solo test por nombre
```

## Arquitectura

NestJS 12 (TypeScript 6, Express, Jest 30 + ts-jest) con **arquitectura por capas**: `controller → service → repository/entity`, un módulo Nest por entidad/agregado, registrado en `AppModule`. El código actual es solo el esqueleto generado (`AppController`/`AppService`); aún no hay BD, auth ni módulos de dominio.

Pendiente de decidir/implementar (según el plan, "Ola 0"): ORM/driver MySQL, guard JWT + roles contra el servicio de seguridad, filtro global de errores, cliente HTTP de notificaciones, enums compartidos.

### Convenciones acordadas (Plan de trabajo §7)

- Prefijo `/api/v1/...`, JSON, campos en `camelCase`.
- Errores con formato único `{ timestamp, status, error, message, path }`; `400` validación, `401` sin token, `403` sin rol, `404` no existe, `409` duplicado o con asociaciones.
- Eliminación: preferir desactivación lógica (`activo`) y `409` si existen asociaciones.
- Listados paginados `?page=&size=` → `{ content, totalElements }`.
- Enums: Torneo `INSCRIPCIONES_ABIERTAS|EN_CURSO|FINALIZADO|CANCELADO`; Partido `PROGRAMADO|EN_CURSO|FINALIZADO|CANCELADO`; Apuesta `REGISTRADA|GANADA|PERDIDA|ANULADA|CANCELADA`; selección `GANA_LOCAL|EMPATE|GANA_VISITANTE`; Fase `GRUPOS|FINAL`.
- Las notificaciones no deben bloquear ni revertir la operación principal si fallan.
- Una rama por entidad/HU (`feature/<HU>-<entidad>`) con PR revisado por otro integrante. Entidades 🔴 requieren colección Postman (casos 201/400/409/404/401/403) exportada a `/postman`; las 🟢 requieren además interfaz.

## Contexto del trabajo (carpeta `context/`, local, no versionada)

### Enunciado (`Enunciado_1.md`, universo del discurso)

Empresa organizadora de eventos de **deportes con pelota** (fútbol, baloncesto, voleibol, tenis…). Puntos del enunciado que condicionan el modelo y que conviene no perder de vista:
- Un torneo se desarrolla por **etapas** (p. ej. fase de grupos y luego fase final) → herencia Fase → Grupo/Final.
- Un **equipo puede competir en varios deportes y torneos**, y existir en distintas modalidades (ej.: Real Madrid con equipo de fútbol y de baloncesto, masculino y femenino). El script actual de `equipo` solo tiene `nombre` y `fecha_creacion`: no hay atributo de modalidad/género; si se necesita, hay que acordarlo (no asumirlo).
- Debe haber **historial de equipos por los que ha pasado un jugador** (Equipo Jugador con fechas, nunca borrar el vínculo).
- Un jugador de un deporte "tradicional" puede participar también en una **subcategoría** (fútbol → fútbol de salón): justifica la autorrelación de Deporte y plantea que un jugador/equipo se relacione con deporte y subdeporte.
- Los escenarios son **jerárquicos** (complejo → espacios) y tienen **localidades** para asistentes.
- Del partido se conocen equipos, lugar y pelota; se registran anotaciones y el jugador responsable, y se almacena la **posición de jugadores y pelota en distintos momentos** para análisis y un tablero interactivo (pizarra). Esto respalda el modelo de coordenadas con tiempo del plan (x, y, timestamp), **lo que contradice** `posicion_espacial` como catálogo del script; confirmar con el equipo antes de implementar (es de B, pero A toca `jugador.id_posicion`).
- Aficionado: equipos favoritos, compra de entradas (localidad + partido), apuestas con varios métodos de pago registrados.
- El sistema debe permitir consultar, registrar, modificar y eliminar "cuando corresponda" → reglas de eliminación con validación de asociaciones.

Archivos: `Enunciado_1.md` (enunciado, referencia una imagen `Enunciado_1_imagen1.png` del tablero que no está en la carpeta), `Plan_Trabajo_Microservicio_Negocio.md` (reparto y reglas), `Anexo_2_Modulo_Gestion_Deportiva.md` (HU-GD-01..08), `Anexo_3_Modulo_Gestion_Competencias.md` (HU-GC-01..11), `Diagrama_Modelo_Dominio.md`, `Script_Base_Datos_Torneos.md` (DDL MySQL 8). Consultar los anexos para los criterios de aceptación detallados antes de implementar una HU.

### Mi parte: Integrante A — núcleo deportivo y estructura del torneo

Entidades (12): Deporte 🔴, Fase 🔴 (abstracta), Grupo 🔴 (solo API+Postman); Final, Torneo, Equipo, Equipo Deporte, Jugador, Equipo Jugador, Inscripción, Escenario, Escenario Torneo 🟢 (API+UI).
Historias: HU-GD-01, 02, 03, 04, 05, 08 · HU-GC-01, 03, 04, 05 y **HU-GC-08a** (inscripciones; el Anexo 3 tiene dos "HU-GC-08", la otra es *consultar desarrollo del torneo*, de B).
Prioridad para desbloquear a B: Deporte → Equipo → Jugador → Equipo Jugador → Torneo → Fase.

Reglas de negocio clave:
- **Deporte**: subdeportes (autorrelación); nombre único dentro del mismo padre; no eliminar con subdeportes/equipos/torneos (`409`).
- **Equipo–Deporte**: ambos existen, sin repetir (`409`); quitar la asociación no borra equipo ni deporte; consulta en ambos sentidos.
- **Equipo Jugador**: `fechaInicio`/`fechaFin`; retirar = cerrar el vínculo (historial), no borrar al jugador; no repetir asociación vigente.
- **Jugador**: identificador único (documento); validar asociaciones al eliminar. **Perfil (HU-GD-08)**: datos + equipos + habilidades (las habilidades las provee B).
- **Torneo**: pertenece a un deporte existente; estado y fechas (inicio, cierre de inscripciones); validar fases/partidos antes de eliminar.
- **Inscripción**: el equipo debe estar asociado al deporte del torneo; sin duplicados; si el torneo ya inició o las inscripciones cerraron → bloquear inscribir y retirar.
- **Fase**: un solo torneo, `orden`, `tipo` GRUPOS/FINAL; no eliminar si tiene información asociada. **Grupo**: un equipo no puede estar en dos grupos de la misma fase ni repetirse en un grupo; borrar grupo no borra equipos. **Final**: llaves (octavos…final); sus partidos se identifican como "fase final".
- Contrato interno que A expone a B: equipos habilitados/inscritos de un torneo, jugadores con contrato vigente, estructura del torneo (fases ordenadas, grupos y equipos), escenarios disponibles. A necesita de B: habilidades de un jugador y partidos por fase (para validar eliminaciones).

Decisiones abiertas del plan (confirmar antes de asumir): resultado guardado en Partido; tabla intermedia Grupo–Equipo por fase (el diagrama dice FK directa); si un jugador puede tener contratos simultáneos; `Aficionado.usuario_id` enlaza con el usuario de seguridad.

### Base de datos (`ms_negocio_deportes`, MySQL 8 / InnoDB)

El script `Script_Base_Datos_Torneos.md` es la fuente de verdad del esquema y **difiere del plan en varios puntos**; seguir el script:
- PK `id_<entidad>` BIGINT autoincrement; nombres de tablas/columnas en `snake_case`.
- Herencia de Fase por tabla padre + hijas: `fase(tipo ENUM('GRUPO','FINAL'))`, `grupo(id_fase PK/FK, nombre_grupo)`, `fase_final(id_fase PK/FK, modalidad)`. Ojo: el enum de BD es `GRUPO`, no `GRUPOS`.
- `posicion_espacial` es hoy un **catálogo de posiciones** del jugador (`jugador.id_posicion`: nombre/descripción), no coordenadas x/y con tiempo como describen el plan y el enunciado (discrepancia abierta, ver Enunciado).
- El script nombra la BD `torneos_deportivos` mientras este archivo indica `ms_negocio_deportes`: confirmar cuál se usa en la configuración de conexión.
- `partido` guarda torneo/fase/escenario/pelota; local y visitante están en `partido_equipo` (`rol` LOCAL/VISITANTE, PK `(id_partido, rol)`).
- `aficionado.usuario_id` (UNIQUE) referencia al usuario del servicio de seguridad **sin FK** (otra BD).
- `inscripcion` UNIQUE `(id_torneo, id_equipo)`; `escenario_torneo` PK compuesta; `torneo` valida `fecha_fin >= fecha_inicio`.
- `apuesta` usa FK compuesta `(id_metodo_aficionado, id_aficionado)` para garantizar que el método de pago es del apostador; `monto > 0`.
- Muchas FK son `ON DELETE RESTRICT` (borrar con dependencias falla → mapear a `409`); `fase`/`grupo`/`fase_final`/`escenario_torneo` hacen cascade desde `torneo`.

## Lint / formato

oxlint con `no-explicit-any` apagado y `no-floating-promises` en warn. Prettier configurado en `.prettierrc`.
