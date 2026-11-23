# Propuesta Técnica: Pulido de Tablero en Vivo y Completitud Integral (Participante B)

**Fecha:** 23 de Noviembre de 2026  
**Autor:** Antigravity Architect (para Participante B)  
**Estado:** PENDIENTE DE APROBACIÓN DEL USUARIO  
**Gobernanza:** Regla de Oro de 150 líneas estrictas por archivo | Cero SDKs comerciales | POO & Tipado Estricto  

---

## 1. Diagnóstico del Estado Actual de la Persona B

De acuerdo con el documento oficial **"Plan de trabajo – Microservicio de Negocio"** (Secciones 2.1, 5.1, 5.2, 5.3 y 7), el **Participante B** tiene asignadas **11 entidades** (9 con interfaz gráfica y 2 rojas con API + Postman) y **7 historias de usuario completas más 2 parciales**:

### 1.1. Matriz de Entidades de B
1. **Partido** (Verde: API + Interfaz)
2. **Anotación** (Verde: API + Interfaz)
3. **Pelota** (Roja: API + Postman)
4. **Posición Espacial** (Roja: API + Postman)
5. **Habilidad Jugador** (Verde: API + Interfaz)
6. **Localidad** (Verde: API + Interfaz)
7. **Boleto** (Verde: API + Interfaz)
8. **Aficionado** (Verde: API + Interfaz)
9. **Aficionado Equipo** (Verde: API + Interfaz)
10. **MétodoPago Aficionado** (Verde: API + Interfaz)
11. **Apuesta** (Verde: API + Interfaz)

### 1.2. Hallazgos y Elementos a Completar / Sincronizar
1. **Backend - Endpoint de Contrato Interno para Participante A (Sección 5.3 y 8.1):**
   - El participante A requiere consultar los partidos de una fase para validar si una fase o grupo se puede eliminar. Falta el endpoint explícito `GET /api/v1/fases/:id/partidos`.
2. **Backend - Métodos HTTP duales requeridos por el estándar del plan:**
   - En el plan se especifica `PUT /partidos/{id}/resultado` (actualmente solo escucha en `POST`). Agregaremos soporte dual (`PUT` y `POST`).
   - En el plan se especifica `POST /apuestas/{id}/cancelar` (actualmente solo escucha en `PATCH`). Agregaremos soporte dual (`POST` y `PATCH`).
3. **Frontend - Renovación y Pulido Mayor del Tablero en Vivo / Pizarra Táctica (HU-GC-09):**
   - Actualmente, la vista de la pizarra (`PizarraCampoPage.tsx`) tiene un diseño básico, un marcador monocolor sin discriminación de goles por equipo, un césped plano y controles rudimentarios.
   - **Mejoras clave a implementar:**
     - **Tablero Marcador Electrónico de Estadio (Scoreboard)**: Cronómetro interactivo (minutos/segundos), indicador de período (1T / 2T / FIN), insignias de equipo con sus colores y tipografía digital, desglose de goles para Local y Visitante.
     - **Césped 2D Realista con Franjas y Marcado FIFA**: Textura a rayas con gradientes esmeralda, arcos de córner, áreas penal y chica, puntos de penal, círculos centrales, y porterías con malla de red.
     - **Fichas Tácticas de Jugadores**: Dorsales destacados, aros luminosos según equipo, etiquetas de nombres, posiciones tácticas (POR, DEF, MED, DEL) y sombreado 3D.
     - **Balón Dinámico**: Balón con textura de hexágonos clásica, sombra proyectada en el césped y animación fluida al desplazarse.
     - **Controles de Simulación**: Modos Auto/Pausa, velocidad configurable (1x, 2x), jugadas simuladas (pases rápidos, ataques, remate a puerta) con animación festiva de ¡GOL!.
     - **Feed de Sucesos en Vivo (Live Match Feed)**: Línea de tiempo cronológica lateral que reporta goles, tarjetas, tiros a puerta y jugadas en vivo.
     - **Panel de Estadísticas del Encuentro**: Posesión de balón (%), tiros a puerta, faltas y tiros de esquina calculados en tiempo real.

---

## 2. Arquitectura de Componentes Modulares (< 150 líneas)

Para cumplir con la **Regla de Oro de 150 líneas por archivo**, fragmentaremos la funcionalidad del tablero en componentes altamente cohesivos y especializados:

```
src/features/sports/pizarra/
├── domain/
│   └── pizarraModels.ts               # Tipos e interfaces de estados, jugadores y estadísticas
├── application/
│   ├── pizarraService.ts              # Comunicación HTTP y lógica de alineaciones
│   └── simuladorJugadasService.ts     # Generador de trayectorias, jugadas y goles
└── infrastructure/
    ├── PizarraCampoPage.tsx           # Contenedor orquestador principal (< 120 líneas)
    ├── TableroMarcadorVivo.tsx        # Marcador electrónico estilo estadio (< 110 líneas)
    ├── CampoDeportivoSvg.tsx          # Renderizado SVG del césped reglamentario (< 130 líneas)
    ├── JugadoresCapaTactico.tsx       # Capa de fichas de jugadores y balón (< 115 líneas)
    ├── ControlesSimulacionBar.tsx     # Barra de control de simulación y botones (< 105 líneas)
    ├── FeedEventosEnVivo.tsx          # Panel lateral con feed de goles y jugadas (< 100 líneas)
    └── EstadisticasPartidoPanel.tsx   # Posesión, remates y faltas en vivo (< 95 líneas)
```

---

## 3. Plan de Ejecución Paso a Paso

1. **Paso 1 (Backend):**
   - Añadir `GET /api/v1/fases/:faseId/partidos` en `PartidosController` y `PartidosService`.
   - Habilitar métodos duales `PUT /api/v1/partidos/:id/resultado` y `POST /api/v1/apuestas/:id/cancelar`.
   - Verificar compilación y pruebas unitarias de backend con `npm test`.

2. **Paso 2 (Frontend - Dominio y Servicios de Pizarra):**
   - Actualizar `pizarraModels.ts` con estructuras para eventos en vivo, estadísticas y cronómetro.
   - Crear `simuladorJugadasService.ts` (< 150 líneas) para desacoplar el cálculo matemático y de trayectorias.

3. **Paso 3 (Frontend - Componentes Visuales del Tablero en Vivo):**
   - Crear `TableroMarcadorVivo.tsx`: cronómetro en vivo, escudos, desglose de goles por equipo y estado.
   - Refactorizar `CampoDeportivoSvg.tsx`: césped rayado fotorrealista con gradientes y marcación SVG reglamentaria.
   - Crear `JugadoresCapaTactico.tsx`: renderizado posicional con estilo dinámico, dorsales, etiquetas y balón con rotación.
   - Crear `ControlesSimulacionBar.tsx`: play/pause, velocidades y botones tácticos.
   - Crear `FeedEventosEnVivo.tsx` y `EstadisticasPartidoPanel.tsx`: información viva para el aficionado.
   - Integrar todo en `PizarraCampoPage.tsx` manteniendo cada archivo estrictamente bajo 150 líneas.

4. **Paso 4 (Auditoría y Validación):**
   - Ejecutar auditoría estricta de conteo de líneas (`Get-Content ... | Measure-Object -Line`).
   - Compilar frontend con `npm run build` (`tsc -b && vite build`).
   - Compilar backend y ejecutar pruebas unitarias `npm test`.
   - Generar informe final de ejecución.

---

> [!IMPORTANT]
> **Pausa Obligatoria de Gobernanza:** De acuerdo con la sección 2.2 y 4 del Contrato de Gobernanza Técnica, no se aplicarán modificaciones en el código fuente hasta contar con la aprobación explícita del usuario sobre esta propuesta.
