# Propuesta Técnica: Módulos del Participante B (Microservicio de Negocio)

## 1. Resumen Ejecutivo
Como Participante B del proyecto de Gestión Deportiva y Competencias, este documento formaliza la arquitectura, diseño de datos y estrategia de implementación para el backend de las 11 entidades y 9 historias de usuario (7 completas + 2 parciales) asignadas.

El desarrollo se fundamentará en el stack NestJS + TypeORM + MySQL estipulado en los tutoriales del curso, respetando Clean Code, arquitectura modular por rebanadas verticales (Vertical Slicing), límite estricto de 150 líneas por archivo y cero SDKs comerciales opacos.

## 2. Alcance Funcional del Participante B
Entidades directas bajo nuestra responsabilidad:
- `Partido` 🟢 (API + UI futura)
- `Anotación` 🟢 (API + UI futura)
- `Pelota` 🔴 (API + Colección Postman)
- `Posición Espacial` 🔴 (API + Colección Postman)
- `Habilidad Jugador` 🟢 (API + UI futura)
- `Localidad` 🟢 (API + UI futura)
- `Boleto` 🟢 (API + UI futura)
- `Aficionado` 🟢 (API + UI futura)
- `Aficionado Equipo` 🟢 (API + UI futura)
- `MétodoPago Aficionado` 🟢 (API + UI futura)
- `Apuesta` 🟢 (API + UI futura)

Historias de Usuario:
- **HU-GC-06**: Gestión de partidos (programación, estados, validación equipos, envío de correos).
- **HU-GC-07**: Registro de resultados y anotaciones (validación de jugador, notificaciones y liquidación automática).
- **HU-GC-08b**: Consulta del desarrollo del torneo (clasificación, grupos y llaves).
- **HU-GC-09**: Seguimiento deportivo en vivo (pizarra, posiciones espaciales en lote, historial).
- **HU-GC-10**: Métodos de pago del aficionado (asociación, validación y soft-delete).
- **HU-GC-11**: Gestión de apuestas (cuotas congeladas, validaciones de tiempo, liquidación).
- **HU-GD-07**: Asignación de habilidades a jugadores.

## 3. Estrategia de Aislamiento y Contratos de Integración (Stubs)
Para garantizar autonomía y que los participantes A y C puedan integrarse fluidamente sin bloqueos:
- Se crean stubs tipados para `Equipo`, `Fase`, `Jugador`, `Escenario` (Participante A), así como `Habilidad` y `Método Pago` (Participante C).
- Estos stubs proveen las migraciones y esquemas mínimos necesarios para levantar las relaciones foráneas (FK) en MySQL.
- Los módulos de A y C se organizan de forma desacoplada para que ellos solo completen sus controllers/services/mappers sin romper los módulos de B.
- La integración con notificaciones se realiza mediante cliente HTTP nativo con resiliencia (no bloqueante en fallas).

## 4. Plan de Pruebas y Postman
Se estructurará una colección Postman completa que cubrirá:
- Casos exitosos (200, 201).
- Validaciones DTO y negocio (400, 422).
- Reglas de integridad y duplicados (409).
- Recursos inexistentes (404).
- Validación de seguridad y token (401, 403).
