# Plan de trabajo – Microservicio de Negocio

> **Proyecto del Curso – Desarrollo Backend**
> Módulos: **Gestión Deportiva** (Anexo 2, HU-GD) y **Gestión de Competencias** (Anexo 3, HU-GC)
> Equipo: 3 participantes (**A**, **B** y **C**)

---

## 1. Contexto y alcance

Esta entrega corresponde al **microservicio de negocio**. Los siguientes componentes **ya están implementados** y solo se **integran**, no se desarrollan:

| Componente | Estado | Qué debemos hacer nosotros |
|---|---|---|
| Microservicio de seguridad | Implementado | Validar el token (JWT) en cada endpoint y aplicar roles (`ADMIN_DEPORTIVO`, `AFICIONADO`). |
| Frontend de seguridad | Implementado | Reutilizar login/sesión/guards en las pantallas nuevas. |
| Microservicio de notificaciones | Implementado | Consumirlo desde el negocio (correos y notificaciones de partidos, anotaciones, resultados y apuestas). |

---

## 2. Cómo se interpretó el diagrama de clases

La **única** marca que define el entregable es el color de la entidad:

| Marca en el diagrama | Entregable obligatorio |
|---|---|
| 🔴 **Rojo** | **Solo backend: API REST + colección Postman** (casos positivos y negativos). **Sin interfaz gráfica.** |
| 🟢 **Verde** (cualquier tono) | API REST + **interfaz gráfica**. El tono no cambia nada. |

> El tono del verde **no indica** si la entidad es asociativa o no. Que una entidad sea una tabla de relación (por ejemplo, Equipo Deporte o Inscripción) se deduce de la **estructura del diagrama**, no del color, y se describe por separado en las secciones de cada participante.

> 💡 Postman es obligatorio para las rojas. Para las verdes es opcional, aunque ayuda a probar el backend antes de que exista la interfaz.

### 2.1 Inventario de las 25 entidades

| # | Entidad | Color | Entregable | Responsable |
|---|---|---|---|---|
| 1 | Deporte | 🔴 | API + Postman | **A** |
| 2 | Fase (abstracta) | 🔴 | API + Postman | **A** |
| 3 | Grupo (hija de Fase) | 🔴 | API + Postman | **A** |
| 4 | Final (hija de Fase) | 🟢 | API + Interfaz | **A** |
| 5 | Torneo | 🟢 | API + Interfaz | **A** |
| 6 | Equipo | 🟢 | API + Interfaz | **A** |
| 7 | Equipo Deporte | 🟢 | API + Interfaz | **A** |
| 8 | Jugador | 🟢 | API + Interfaz | **A** |
| 9 | Equipo Jugador | 🟢 | API + Interfaz | **A** |
| 10 | Inscripción | 🟢 | API + Interfaz | **A** |
| 11 | Escenario | 🟢 | API + Interfaz | **A** |
| 12 | Escenario Torneo | 🟢 | API + Interfaz | **A** |
| 13 | Partido | 🟢 | API + Interfaz | **B** |
| 14 | Anotación | 🟢 | API + Interfaz | **B** |
| 15 | Pelota | 🔴 | API + Postman | **B** |
| 16 | Posición Espacial | 🔴 | API + Postman | **B** |
| 17 | Habilidad Jugador | 🟢 | API + Interfaz | **B** |
| 18 | Localidad | 🟢 | API + Interfaz | **B** |
| 19 | Boleto | 🟢 | API + Interfaz | **B** |
| 20 | Aficionado | 🟢 | API + Interfaz | **B** |
| 21 | Aficionado Equipo | 🟢 | API + Interfaz | **B** |
| 22 | MétodoPago Aficionado | 🟢 | API + Interfaz | **B** |
| 23 | Apuesta | 🟢 | API + Interfaz | **B** |
| 24 | Habilidad | 🔴 | API + Postman | **C** |
| 25 | Método Pago | 🔴 | API + Postman | **C** |

### 2.2 Inventario de las 19 historias de usuario

> ⚠️ En el Anexo 3 hay **dos historias numeradas HU-GC-08** ("Gestionar inscripciones" y "Consultar desarrollo de un torneo"). En este documento se llaman **HU-GC-08a** (inscripciones) y **HU-GC-08b** (consultar desarrollo). Conviene confirmar la numeración correcta con el docente.

Puntos = estimación relativa de esfuerzo (1 = muy simple, 5 = muy compleja). Las entidades sin historia propia (Escenario, Escenario Torneo, Localidad, Boleto, Aficionado, Aficionado Equipo) se estimaron en **2 puntos** cada una (CRUD + pantalla).

| HU | Nombre | Pts | Responsable |
|---|---|---|---|
| HU-GD-01 | Gestionar deportes | 3 | A |
| HU-GD-02 | Gestionar equipos | 3 | A |
| HU-GD-03 | Asociar equipos con deportes | 2 | A |
| HU-GD-04 | Gestionar jugadores | 3 | A |
| HU-GD-05 | Asignar jugadores a equipos | 3 | A |
| HU-GD-06 | Gestionar habilidades | 2 | **C** |
| HU-GD-07 | Asignar habilidades a jugadores | 2 | B |
| HU-GD-08 | Consultar perfil deportivo del jugador | 2 | A |
| HU-GC-01 | Gestionar torneos | 3 | A |
| HU-GC-08a | Gestionar inscripciones de equipos en torneos | 4 | A |
| HU-GC-03 | Gestionar fases de un torneo | 3 | A |
| HU-GC-04 | Gestionar grupos de competencia | 4 | A |
| HU-GC-05 | Gestionar fases finales | 2 | A |
| HU-GC-06 | Gestionar partidos (+ correo) | 5 | B |
| HU-GC-07 | Resultados y anotaciones (+ notificaciones) | 5 | B |
| HU-GC-08b | Consultar desarrollo de un torneo | 5 | B |
| HU-GC-09 | Seguimiento deportivo del partido (pizarra) | 3 *(B)* + 3 *(C: script)* | B y C |
| HU-GC-10 | Gestionar métodos de pago | 2 *(B)* + 2 *(C: catálogo)* | B y C |
| HU-GC-11 | Gestionar apuestas sobre partidos | 5 | B |

---

## 3. Resumen de la distribución

| | **Participante A** | **Participante B** | **Participante C** |
|---|---|---|---|
| **Enfoque** | Núcleo deportivo + estructura del torneo | Partidos, aficionados, apuestas y seguimiento en vivo | Catálogos de apoyo + simulador |
| **Entidades** | 12 | 11 | 2 |
| ↳ con interfaz (verdes) | 9 | 9 | 0 |
| ↳ solo Postman (rojas) | 3 | 2 | 2 |
| **HU completas** | 11 | 7 | 1 |
| **HU parciales** | – | GC-09 (pizarra), GC-10 | GC-09 (script), GC-10 (catálogo) |
| **Puntos estimados** | ≈ 36 | ≈ 35 | ≈ 7 |
| **Integra con notificaciones** | No | **Sí** (GC-06, GC-07, GC-11) | No |

**Criterio de reparto entre A y B:** se buscó equilibrio en *puntos de esfuerzo*, número de pantallas y número de entidades, agrupando por cohesión de dominio para reducir dependencias. A concentra más historias de CRUD y reglas de estructura (torneo → fases → grupos); B concentra las historias con integraciones y lógica más compleja (notificaciones, liquidación de apuestas, pizarra).

**Participante C** recibe solo **2 entidades rojas** (Habilidad y Método Pago, catálogos simples y sin interfaz) y dos piezas pequeñas e independientes de historias ajenas: el **script simulador** de posiciones (HU-GC-09) y la **definición del catálogo/validaciones** de métodos de pago (HU-GC-10).

> Si C termina antes, puede tomar **Localidad + Boleto** de B (ver sección 8).

---

## 4. Participante A – Núcleo deportivo y estructura del torneo

**Entidades (12):** Deporte 🔴, Fase 🔴, Grupo 🔴, Final 🟢, Torneo 🟢, Equipo 🟢, Equipo Deporte 🟢, Jugador 🟢, Equipo Jugador 🟢, Inscripción 🟢, Escenario 🟢, Escenario Torneo 🟢
**Historias (11):** HU-GD-01, 02, 03, 04, 05, 08 · HU-GC-01, 08a, 03, 04, 05

### 4.1 Entidades

| Entidad | Entregable | Relaciones (según diagrama) | Endpoints sugeridos |
|---|---|---|---|
| **Deporte** 🔴 | API + Postman | Auto-relación 1:n (deporte → subdeportes). 1:n con Torneo. n:n con Equipo (Equipo Deporte). | `/deportes` (CRUD) · `/deportes/{id}/subdeportes` · `/deportes/{id}/equipos` · `PATCH /deportes/{id}/estado` |
| **Equipo** 🟢 | API + UI | n:n Deporte, n:n Jugador, n:n Torneo (Inscripción), n:n Aficionado (Aficionado Equipo), Grupo 1:n Equipo. | `/equipos` (CRUD) · `/equipos/{id}/deportes` · `/equipos/{id}/jugadores` · `/equipos/{id}/torneos` |
| **Equipo Deporte** 🟢 | API + UI | Tabla asociativa Equipo–Deporte. | `POST /equipos/{id}/deportes/{deporteId}` · `DELETE` del mismo · `GET /equipos/{id}/deportes` · `GET /deportes/{id}/equipos` |
| **Jugador** 🟢 | API + UI | n:n Equipo (Equipo Jugador), n:n Habilidad (Habilidad Jugador), 1:n Anotación, 1:n Posición Espacial. | `/jugadores` (CRUD) · `GET /jugadores/{id}/perfil` |
| **Equipo Jugador** 🟢 | API + UI | Asociativa Equipo–Jugador con `fechaInicio` y `fechaFin` del contrato. | `POST /equipos/{id}/jugadores` · `PUT /equipos/{id}/jugadores/{jugadorId}` · `DELETE` (retiro) · `GET /equipos/{id}/jugadores` · `GET /jugadores/{id}/equipos` |
| **Torneo** 🟢 | API + UI | n:1 Deporte, 1:n Fase, n:n Equipo (Inscripción), n:n Escenario (Escenario Torneo). | `/torneos` (CRUD) · `/torneos/{id}/fases` |
| **Inscripción** 🟢 | API + UI | Asociativa Torneo–Equipo. | `POST /torneos/{id}/inscripciones` · `DELETE /torneos/{id}/inscripciones/{equipoId}` · `GET /torneos/{id}/equipos` · `GET /equipos/{id}/torneos` |
| **Fase** 🔴 (abstracta) | API + Postman | n:1 Torneo, 1:n Partido. Padre de Grupo y Final (herencia). Tiene `orden` y `tipo`. | `POST/GET /torneos/{torneoId}/fases` · `PUT/DELETE /fases/{id}` |
| **Grupo** 🔴 | API + Postman | Hereda de Fase. 1:n Equipo. | `/fases/{faseId}/grupos` · `/grupos/{id}` · `POST/GET/DELETE /grupos/{id}/equipos` |
| **Final** 🟢 | API + UI | Hereda de Fase (llaves: octavos, cuartos, semifinal, final). | `/torneos/{id}/fase-final` (CRUD) · `GET /fases/{id}/partidos` |
| **Escenario** 🟢 | API + UI | Auto-relación 1:n (complejo → sub-escenarios), 1:n Localidad, 1:n Partido, n:n Torneo. | `/escenarios` (CRUD) · `/escenarios/{id}/subescenarios` |
| **Escenario Torneo** 🟢 | API + UI | Asociativa Torneo–Escenario. | `POST/DELETE /torneos/{id}/escenarios/{escenarioId}` · `GET` en ambos sentidos |

### 4.2 Historias de usuario

| HU | Entregables | Reglas de negocio que no deben olvidarse |
|---|---|---|
| **HU-GD-01** Deportes | API + **Postman** (Deporte es roja) | Soporta **subdeportes** (fútbol → fútbol de salón, callejero…). Sin duplicados (nombre único dentro del mismo padre). Eliminar/desactivar: si tiene subdeportes, equipos o torneos asociados → responder `409` con mensaje claro. |
| **HU-GD-02** Equipos | API + UI | Validar campos obligatorios; consulta de listado y detalle; antes de eliminar validar jugadores, inscripciones y deportes asociados. |
| **HU-GD-03** Asociar equipo–deporte | API + UI | Ambos deben existir; no repetir la asociación (`409`); retirar la asociación **no** elimina equipo ni deporte; consultas en ambos sentidos. |
| **HU-GD-04** Jugadores | API + UI | Identificador único (p. ej. documento) para evitar duplicados; eliminación valida equipos/anotaciones asociadas. |
| **HU-GD-05** Asignar jugadores a equipos | API + UI | Define `fechaInicio` y `fechaFin`; **retirar = cerrar el vínculo (historial de traspasos), no borrar el jugador**; el jugador queda disponible para otros equipos; no repetir una misma asociación vigente. |
| **HU-GD-08** Perfil deportivo del jugador | UI (vista de consulta) + endpoint agregado | Muestra datos básicos, equipos (de Equipo Jugador) y habilidades (**las provee B** desde Habilidad Jugador). Mensajes explícitos si no tiene equipos / habilidades. |
| **HU-GC-01** Torneos | API + UI | Debe pertenecer a un deporte existente; guardar **estado** y **fechas** del torneo (inicio, cierre de inscripciones); antes de eliminar validar fases/partidos. |
| **HU-GC-08a** Inscripciones | API + UI | Torneo y equipo existentes; **el equipo debe estar asociado al deporte del torneo**; no inscribir dos veces; **si el torneo ya inició o las inscripciones están cerradas → bloquear inscripción y retiro**; mensajes de éxito al inscribir/retirar. |
| **HU-GC-03** Fases | API + **Postman** (Fase es roja) | Fase pertenece a un solo torneo; `orden` de ejecución; `tipo` = GRUPOS o FINAL; eliminar fase no elimina el torneo; bloquear eliminación si tiene info asociada. |
| **HU-GC-04** Grupos | API + **Postman** (Grupo es roja) | Fase y torneo existentes; asignar varios equipos; **un equipo no puede estar en dos grupos de la misma fase**; no repetir equipo en un grupo; borrar grupo no borra equipos. |
| **HU-GC-05** Fase final | API + UI (Final es verde) | Torneo existente; modificar solo mientras las reglas lo permitan; no afecta otras fases; sus partidos deben identificarse como "fase final". |

### 4.3 Lo que A debe exponer a B (contrato interno)

- Equipo habilitado para un torneo/fase (inscrito y activo).
- Jugadores **vigentes** de un equipo (Equipo Jugador con contrato activo).
- Estructura del torneo: fases ordenadas, grupos y equipos por grupo, fase final.
- Escenarios disponibles.

> 🔑 **Prioridad para desbloquear a B:** terminar primero Deporte → Equipo → Jugador → Equipo Jugador → Torneo → Fase (en ese orden).

---

## 5. Participante B – Partidos, aficionados, apuestas y seguimiento

**Entidades (11):** Partido 🟢, Anotación 🟢, Pelota 🔴, Posición Espacial 🔴, Habilidad Jugador 🟢, Localidad 🟢, Boleto 🟢, Aficionado 🟢, Aficionado Equipo 🟢, MétodoPago Aficionado 🟢, Apuesta 🟢
**Historias (7 completas + 2 parciales):** HU-GC-06, 07, 08b, 11 · HU-GD-07 · HU-GC-09 (pizarra y API de posiciones) · HU-GC-10 (parte aficionado)

### 5.1 Entidades

| Entidad | Entregable | Relaciones (según diagrama) | Endpoints sugeridos |
|---|---|---|---|
| **Partido** 🟢 | API + UI | n:1 Fase, n:1 Escenario, relación de Equipo consigo mismo (local vs visitante), 1:n Anotación, n:n Aficionado (vía Boleto y Apuesta), usa una Pelota. | `/partidos` (CRUD) · `/fases/{id}/partidos` · `PATCH /partidos/{id}/estado` · `PUT /partidos/{id}/resultado` |
| **Anotación** 🟢 | API + UI | n:1 Partido, n:1 Jugador. | `/partidos/{id}/anotaciones` (CRUD) |
| **Pelota** 🔴 | API + Postman | 1:n Posición Espacial; se asocia al partido. | `/pelotas` (CRUD) |
| **Posición Espacial** 🔴 | API + Postman | n:1 Jugador **o** n:1 Pelota, siempre asociada a un Partido. Atributos: `x`, `y`, `timestamp`. | `POST /partidos/{id}/posiciones` (acepta **lote**) · `GET /partidos/{id}/posiciones/ultimas` · `GET /partidos/{id}/posiciones?desde=` |
| **Habilidad Jugador** 🟢 | API + UI | Asociativa Jugador–Habilidad. | `POST/DELETE /jugadores/{id}/habilidades/{habilidadId}` · `GET /jugadores/{id}/habilidades` · `GET /habilidades/{id}/jugadores` |
| **Localidad** 🟢 | API + UI | n:1 Escenario, 1:n Boleto. | `/escenarios/{id}/localidades` · `/localidades/{id}` |
| **Boleto** 🟢 | API + UI | Asociativa Aficionado–Partido, n:1 Localidad. | `/boletos` · `/partidos/{id}/boletos` · `/aficionados/{id}/boletos` |
| **Aficionado** 🟢 | API + UI | n:n Equipo, n:n Método de Pago, n:n Partido (Boleto/Apuesta). | `/aficionados` (CRUD) |
| **Aficionado Equipo** 🟢 | API + UI | Asociativa Aficionado–Equipo (equipos favoritos). | `POST/DELETE /aficionados/{id}/equipos/{equipoId}` · `GET` |
| **MétodoPago Aficionado** 🟢 | API + UI | Asociativa Aficionado–Método Pago (datos del medio de pago del aficionado). | `/aficionados/{id}/metodos-pago` (CRUD) |
| **Apuesta** 🟢 | API + UI | n:1 Aficionado, n:1 Partido, n:1 MétodoPago Aficionado. | `/apuestas` · `/partidos/disponibles-apuesta` · `/partidos/{id}/apuestas` (admin) · `POST /apuestas/{id}/cancelar` |

### 5.2 Historias de usuario

| HU | Entregables | Reglas de negocio que no deben olvidarse |
|---|---|---|
| **HU-GC-06** Partidos | API + UI + **notificación** | Torneo y fase existentes; **un equipo no juega contra sí mismo**; ambos equipos deben estar habilitados (inscritos en el torneo); escenario opcional; editar solo según estado; eliminar solo sin información asociada. **Al crear el partido:** enviar correo (vía microservicio de notificaciones) a los aficionados que *han participado en partidos anteriores de los equipos enfrentados* (aficionados con boleto o apuesta en partidos previos de esos equipos). |
| **HU-GC-07** Resultados y anotaciones | API + UI + **notificación** | Resultado solo para los equipos del partido; modificable según reglas; la anotación se vincula al jugador y **el jugador debe pertenecer a uno de los dos equipos del partido** (consulta a A); eliminar anotación no borra jugador ni partido. **Al registrar una anotación:** notificar a aficionados con boleto o apuesta sobre ese partido. **Al registrar el resultado final:** notificar el resumen del encuentro a esos mismos aficionados y **disparar la liquidación de apuestas** (HU-GC-11). |
| **HU-GC-08b** Consultar desarrollo del torneo | UI (vista de consulta) + endpoint agregado | Selector de torneo; información general; fases; en fase de **grupos**: grupos, equipos y **tabla de posiciones**; en **fase final**: vista **en llaves**; partidos por fase marcando *con resultado* vs *pendientes*; anotaciones por partido. Solo datos del torneo seleccionado. *(Supuesto de puntaje: victoria 3, empate 1, derrota 0 – confirmar.)* |
| **HU-GC-09** Seguimiento (pizarra) | UI (pizarra) + API + **Postman** (Pelota y Posición Espacial son rojas) | Pizarra gráfica del campo según el deporte; solo jugadores del partido; equipos diferenciados (color/camiseta) y jugador identificable; pelota independiente; las posiciones se **guardan con historial** asociadas a partido + jugador/pelota; la pizarra se actualiza al cambiar una posición (polling, SSE o WebSocket – acordar); finalizar seguimiento no borra partido/jugadores/pelota. El script que genera las posiciones lo hace **C**. |
| **HU-GC-10** Métodos de pago (parte aficionado) | API + UI | Aficionado existente; uno o varios métodos; cada uno queda ligado a su aficionado; validar datos obligatorios **según el tipo** (usar el validador de C); no permitir usar un método de otro aficionado; **eliminar un método no borra operaciones pasadas** (soft delete). |
| **HU-GC-11** Apuestas | API + UI + **notificación** | Partido existente, habilitado y **no iniciado**; registrar selección, valor y **cuota (se congela al apostar)**; método de pago debe ser del aficionado; el aficionado consulta sus apuestas y el admin las de un partido; **no modificar tras iniciar el partido**; cancelación solo si las reglas lo permiten. **Liquidación** (solo con partido finalizado y resultado oficial, **una sola vez**): GANADA → paga `valor × cuota`; PERDIDA → paga 0; ANULADA (partido cancelado) → devuelve lo apostado. Guardar estado final y valor pagado/devuelto. **Notificar** al registrar y al liquidar. |
| **HU-GD-07** Asignar habilidades a jugadores | API + UI | Jugador y habilidad existentes; sin duplicados; agregar/retirar sin borrar la habilidad; consultas en ambos sentidos. |

### 5.3 Lo que B debe exponer a A

- Habilidades de un jugador (para el perfil, HU-GD-08).
- Partidos por fase, resultado y anotaciones (A lo necesita para validar eliminaciones de fase/grupo/final).

---

## 6. Participante C – Catálogos de apoyo y simulador

**Entidades (2):** Habilidad 🔴 · Método Pago 🔴 *(ambas solo API + Postman, sin interfaz)*
**Historias:** HU-GD-06 completa · HU-GC-10 (catálogo) · HU-GC-09 (script simulador)

### 6.1 Entidades

| Entidad | Entregable | Relaciones | Endpoints sugeridos |
|---|---|---|---|
| **Habilidad** 🔴 | API + Postman | n:n Jugador (vía Habilidad Jugador, de B). | `/habilidades` (CRUD) |
| **Método Pago** 🔴 | API + Postman | n:n Aficionado (vía MétodoPago Aficionado, de B). | `/metodos-pago` (CRUD) |

### 6.2 Historias de usuario / tareas

| Tarea | Detalle |
|---|---|
| **HU-GD-06** Gestionar habilidades | Registrar, listar, consultar detalle, actualizar y eliminar; validar obligatorios; **sin duplicados** (nombre único); al eliminar, validar si está asociada a jugadores y responder con mensaje claro (`409`). |
| **HU-GC-10 (parte catálogo)** Método Pago | CRUD del catálogo de tipos (p. ej. tarjeta crédito, tarjeta débito, PSE, billetera). Definir **qué campos son obligatorios por tipo** y exponer un **validador reutilizable** para que B valide `MétodoPago Aficionado`. |
| **HU-GC-09 (parte script)** Simulador de posiciones | Script independiente (Python/Node u otro) que, dado un `partidoId`, lee jugadores de ambos equipos y simula movimientos de jugadores y pelota, enviándolos en **lote** a `POST /partidos/{id}/posiciones` cada N ms. Parámetros: partido, intervalo, duración, token. Debe respetar el contrato de B (coordenadas normalizadas, ver sección 7). |
| **Postman** | Colecciones de Habilidad y Método Pago (ver sección 9.1). |

> Entregables de apoyo opcionales (cuando termine): revisar PRs, ayudar a armar la colección Postman global y el ambiente compartido.

---

## 7. Acuerdos compartidos (definir en el día 1)

| Tema | Propuesta |
|---|---|
| **Prefijo y versión** | `/api/v1/...`, JSON, nombres de campos en `camelCase`. |
| **Estados de Torneo** | `INSCRIPCIONES_ABIERTAS`, `EN_CURSO`, `FINALIZADO`, `CANCELADO`. |
| **Estados de Partido** | `PROGRAMADO`, `EN_CURSO`, `FINALIZADO`, `CANCELADO`. |
| **Estados de Apuesta** | `REGISTRADA`, `GANADA`, `PERDIDA`, `ANULADA`, `CANCELADA`. |
| **Selección de apuesta** | `GANA_LOCAL`, `EMPATE`, `GANA_VISITANTE` (confirmar si hay más tipos). |
| **Tipo de Fase** | `GRUPOS`, `FINAL`. |
| **Eliminación** | Preferir **desactivación lógica** (`activo`), y `409 Conflict` cuando existan asociaciones. |
| **Errores** | Formato único: `{ timestamp, status, error, message, path }`. Códigos: `400` validación, `401` sin token, `403` sin rol, `404` no existe, `409` duplicado/asociaciones. |
| **Listados** | Paginación `?page=&size=` y respuesta con `content` + `totalElements`. |
| **Coordenadas** | `x`, `y` normalizadas entre `0.0` y `1.0` sobre el campo (la pizarra las escala). |
| **Roles** | `ADMIN_DEPORTIVO`: gestión completa. `AFICIONADO`: sus métodos de pago, apuestas, equipos favoritos y consulta de partidos/torneos. |
| **Migraciones/BD** | Cada quien crea sus tablas; las FK entre módulos se acuerdan antes de crearlas. |

### 7.1 Integraciones transversales

- **Seguridad:** todos los endpoints exigen token; validar rol por endpoint. El script de C necesita un token de administrador (o cuenta de servicio).
- **Notificaciones (solo B):**

| Evento | Destinatarios |
|---|---|
| Partido creado (correo) | Aficionados con boleto/apuesta en partidos anteriores de los equipos enfrentados |
| Anotación registrada | Aficionados con boleto o apuesta sobre el partido |
| Resultado final registrado (resumen) | Aficionados con boleto o apuesta sobre el partido |
| Apuesta registrada / liquidada | El aficionado que apostó |

> El envío **no debe bloquear ni revertir** la operación principal si el microservicio de notificaciones falla (registrar el error y reintentar).

---

## 8. Dependencias y orden de trabajo sugerido

### 8.1 Dependencias entre participantes

| Quien necesita… | …de quién | Para qué |
|---|---|---|
| B (Partido) | A (Fase, Equipo, Inscripción) | Crear partidos con equipos habilitados |
| B (Anotación, pizarra) | A (Jugador, Equipo Jugador) | Validar que el jugador pertenece al partido |
| B (Habilidad Jugador) | C (Habilidad) | Asociar habilidades |
| B (MétodoPago Aficionado) | C (Método Pago + validador) | Validar datos según tipo |
| A (Perfil jugador) | B (Habilidad Jugador) | Mostrar habilidades |
| A (eliminar fase/grupo) | B (Partido) | Validar que no tenga partidos |
| C (script) | B (API de posiciones) y A (jugadores) | Simular y enviar posiciones |
| B (vista del torneo) | A (estructura del torneo) | Mostrar fases, grupos, llaves |

> Mientras una dependencia no esté lista, trabajar con **datos de prueba (mock/semilla)** y no bloquearse.

### 8.2 Olas de trabajo

| Ola | A | B | C |
|---|---|---|---|
| **0 – Base (todos)** | Estructura del proyecto, seguridad (JWT/roles), manejo de errores, ambiente Postman compartido | Cliente de notificaciones, enums compartidos | Habilidad (CRUD + Postman) |
| **1 – Catálogos** | Deporte, Equipo, Jugador, Escenario | Aficionado, Localidad, Pelota | Método Pago (CRUD + Postman + validador por tipo) |
| **2 – Relaciones** | Equipo Deporte, Equipo Jugador, Torneo | Habilidad Jugador, Aficionado Equipo, MétodoPago Aficionado, Boleto | Revisión cruzada de Postman |
| **3 – Estructura** | Inscripción, Fase, Grupo, Final, Escenario Torneo | **Partido** (+ correo), Posición Espacial | Preparar script contra el contrato |
| **4 – Operación** | Perfil jugador (HU-GD-08) | Anotación/Resultados (+ notificaciones), Apuesta y liquidación, Pizarra | Script simulador funcionando |
| **5 – Cierre** | Pruebas de regresión | Vista de desarrollo del torneo (HU-GC-08b) | Prueba de extremo a extremo con script |

**Punto de ajuste:** si al terminar la Ola 2 la carga se ve desbalanceada, mover **Localidad + Boleto** de B a C (son CRUD simples con pantalla) o la vista HU-GC-08b entre A y B.

---

## 9. Convenciones de entrega

### 9.1 Postman (obligatorio para entidades 🔴: Deporte, Fase, Grupo, Pelota, Posición Espacial, Habilidad, Método Pago)

Una carpeta por entidad, con variable de entorno `{{baseUrl}}` y `{{token}}`. Mínimo por entidad:

| Caso | Resultado esperado |
|---|---|
| Crear con datos válidos | `201` |
| Crear con campos obligatorios vacíos | `400` |
| Crear duplicado | `409` |
| Listar y consultar detalle | `200` / `404` si no existe |
| Actualizar | `200` |
| Eliminar sin asociaciones | `200` / `204` |
| Eliminar **con** asociaciones | `409` con mensaje |
| Sin token / rol incorrecto | `401` / `403` |

Agregar tests (`pm.test`) para validar código de estado y estructura de la respuesta. Exportar la colección y el environment al repositorio (`/postman`).

### 9.2 Interfaz (entidades 🟢)

- Listado con paginación y búsqueda, formulario de crear/editar, detalle, confirmación al eliminar.
- Mostrar los mensajes del backend (`400`/`409`) de forma legible.
- Reutilizar login, guards y manejo de sesión del frontend de seguridad.
- Ocultar acciones según el rol.

### 9.3 Definición de "terminado" (por entidad / HU)

- [ ] Todos los criterios de aceptación de la HU cumplidos.
- [ ] Validaciones de obligatorios, duplicados y asociaciones.
- [ ] Seguridad aplicada (token y rol).
- [ ] Postman (obligatorio si es 🔴) y, si es 🟢, interfaz funcionando.
- [ ] Notificaciones probadas (HU-GC-06, 07, 11).
- [ ] Código revisado por otro participante (PR) y fusionado a la rama principal.
- [ ] README o nota breve con endpoints y reglas relevantes.

### 9.4 Trabajo en equipo

- Una rama por entidad/HU (`feature/<HU>-<entidad>`), PR revisado por otro integrante.
- Reunión corta al final de cada ola para integrar y resolver dependencias.

---

## 10. Puntos a confirmar antes de empezar

1. **Numeración:** dos historias se llaman HU-GC-08 en el Anexo 3.
2. **Resultado del partido:** el diagrama no tiene entidad *Resultado*; se propone guardarlo en **Partido** (`marcadorLocal`, `marcadorVisitante`, `estado`). Decidir si el marcador se calcula desde las anotaciones o se ingresa aparte.
3. **Grupo–Equipo:** el diagrama muestra Grupo 1:n Equipo, pero un equipo puede estar en varios torneos. Se recomienda una tabla intermedia **Grupo–Equipo** (por fase) en lugar de una FK directa en Equipo.
4. **Jugador en varios equipos a la vez:** los criterios solo prohíben repetir la misma asociación; definir si un jugador puede tener contratos simultáneos con distintos equipos.
5. **Aficionado vs. usuario de seguridad:** definir si `Aficionado.id` se enlaza con el id del usuario del microservicio de seguridad (recomendado).
6. **Cuota de apuesta:** definir quién la fija (propuesta: el administrador al habilitar apuestas en el Partido, una por selección) y los límites del valor apostado.
7. **Boleto y Localidad:** no tienen HU propia; se asume CRUD básico (localidad con aforo/precio; boleto = aficionado + partido + localidad), sin flujo de pago.
8. **Actualización de la pizarra:** polling, SSE o WebSocket.
9. **Tecnología:** este plan es agnóstico del stack; ajustar nombres de rutas y estructura al framework que use el equipo.
