# ADR 001: Arquitectura y Organización Modular para Participante B

## Estado
Aceptado

## Contexto
El microservicio de negocio integra funcionalidades complejas de gestión de partidos, anotaciones, posiciones espaciales para pizarra en vivo, boletería, métodos de pago de aficionados y apuestas deportivas. El equipo está conformado por 3 personas (A, B y C). La gobernanza técnica exige Vertical Slicing, POO, Clean Code, límite de 150 líneas por archivo y cero SDKs comerciales pesados.

## Decisiones Arquitectónicas

1. **Estructura Vertical por Funcionalidad**:
   Cada dominio bajo control de B residirá en su propia carpeta con arquitectura en capas:
   - `dto/`: DTOs de entrada (`create`, `update`) y salida (`response`).
   - `entities/`: Entidades TypeORM mapeadas a MySQL en `snake_case`.
   - `mappers/`: Mapeadores puros entre DTOs y entidades.
   - `repositories/`: Consultas SQL personalizadas o extensiones del repositorio.
   - `*.service.ts`: Lógica de negocio y orquestación de transacciones.
   - `*.controller.ts`: Endpoints REST con validación y códigos HTTP semánticos.
   - `*.module.ts`: Definición de inyección de dependencias.

2. **Liquidación de Apuestas en Transacción Atómica**:
   Al cambiar el estado del partido a `FINALIZADO` con marcador oficial, se dispara el proceso de liquidación de todas las apuestas registradas asociadas al partido. Este proceso se ejecuta dentro de una transacción para evitar inconsistencias de saldo o estados parciales.

3. **Manejo de Coordenadas para Pizarra (HU-GC-09)**:
   Las coordenadas espaciales `(x, y)` se guardan como números flotantes normalizados `[0.0, 1.0]`. Se provee endpoint de inserción en lote (`batch`) para soportar la ingesta periódica desde el simulador del Participante C.

4. **Desacoplamiento con Stubs (Participantes A y C)**:
   Se definen entidades base para `Equipo`, `Fase`, `Jugador`, `Escenario`, `Habilidad` y `Método Pago` en carpetas dedicadas. Cuando A y C incorporen sus módulos, la base relacional ya estará estructurada sin conflictos.
