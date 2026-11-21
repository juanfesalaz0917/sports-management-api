# Propuesta Técnica: Módulos de Frontend (Participante B)

## 1. Alcance y Enfoque (Participante B)
Siguiendo la matriz del Plan de Trabajo (Anexo 2 y 3) y la regla de colores del diagrama de clases:
- **Entidades Rojas**: `Pelota` y `Posición Espacial` son exclusivamente Backend + Postman (sin pantallas CRUD dedicadas).
- **Entidades Verdes con Interfaz Gráfica Obligatoria (Participante B)**:
  1. **Gestión de Partidos** (`/partidos`): Programación de encuentros, estados en vivo, asignación de equipos, estadio y pelota.
  2. **Registro de Anotaciones y Resultados** (`/partidos/:id/anotaciones`): Marcador oficial, registro de goles/puntos por minuto y jugador.
  3. **Pizarra Táctica de Seguimiento en Vivo** (`/partidos/:id/pizarra` - HU-GC-09): Visualización gráfica interactiva de campo deportivo, jugadores diferenciados por equipo y pelota.
  4. **Consulta del Desarrollo del Torneo** (`/torneos/:id/desarrollo` - HU-GC-08b): Vista de clasificación, fases, grupos y fixture con partidos pendientes vs finalizados.
  5. **Boletería y Localidades** (`/boletos` y `/localidades`): Compra, asignación de asiento y consulta de aforos por escenario.
  6. **Aficionados y Perfil Deportivo** (`/aficionados`): Datos personales, asignación de equipos favoritos y medios de pago tokenizados.
  7. **Apuestas Deportivas** (`/apuestas` - HU-GC-11): Realizar apuestas sobre partidos no iniciados con cuotas congeladas, histórico de apuestas y liquidación visual.
  8. **Asignación de Habilidades a Jugadores** (`/jugadores/:id/habilidades` - HU-GD-07).

## 2. Arquitectura Frontend (Vertical Slicing en React 19)
Se integrará dentro de `mostro-sport-frontend` respetando la estructura existente:
- `src/features/partidos/`: `domain/`, `application/`, `infrastructure/` (List, Form, Detail).
- `src/features/pizarra/`: Visualizador táctico SVG/Canvas con polling / actualización en vivo.
- `src/features/apuestas/`: `domain/`, `application/`, `infrastructure/` (List, NewBetModal).
- `src/features/boletos/`: Emisión y listado de boletos por aficionado y partido.
- `src/features/aficionados/`: Métodos de pago y equipos favoritos.
- `src/core/http/sportsHttpClient.ts`: Cliente HTTP nativo conectado a `http://localhost:3000/api/v1` con inyección de JWT y manejo estandarizado de errores.

## 3. Gobernanza
- Límite inquebrantable de máximo 150 líneas por archivo `.tsx` o `.ts`.
- Reutilización de `AppShell.tsx`, `AuthContext` y componentes de UI atómicos.
