# Diagrama de modelo de dominio (transcripción)

> Transcripción en Markdown del diagrama `An_lisisDescarga.png`. Las cardinalidades se leyeron de las etiquetas visibles; las que no se distinguen con claridad están marcadas con (?).

## Leyenda de colores (esquina superior izquierda)

| Marca | Texto escrito en el diagrama |
|-------|------------------------------|
| Cuadro rojo | `S.I` |
| Cuadro verde | `D.I.R` |

El diagrama no explica qué significan las siglas. Cada entidad lleva una marca de color a la izquierda: rojo, verde oscuro o verde claro.

## Entidades por color de marca

| Marca | Entidades |
|-------|-----------|
| Rojo | Grupo, Fase (abstracta), Deporte, Habilidad, Posición Espacial, Pelota, Método Pago |
| Verde oscuro | Final, Torneo, Escenario, Localidad, Boleto, Partido, Equipo, Aficionado, Jugador, Anotación |
| Verde claro | Escenario Torneo, Inscripción, Equipo Deporte, Equipo Jugador, Aficionado Equipo, Apuesta, MétodoPago Aficionado, Habilidad Jugador |

Las entidades de color verde claro son tablas intermedias (clases de asociación) de relaciones muchos a muchos.

## Herencia

- `Grupo` hereda de `Fase`.
- `Final` hereda de `Fase`.
- `Fase` es una clase `<<Abstract>>`.

## Relaciones

| Origen | Card. | Card. | Destino | Notas |
|--------|:-----:|:-----:|---------|-------|
| Fase | 1 | n | Torneo | |
| Fase | 1 | n | Partido | |
| Grupo | 1 | n | Equipo | |
| Torneo | n | 1 | Deporte | |
| Torneo | n | n | Escenario | Mediante `Escenario Torneo` |
| Torneo | n | n | Equipo | Mediante `Inscripción` (línea punteada) |
| Escenario | 1 | n | Escenario | Autorrelación |
| Escenario | 1 | n | Localidad | |
| Escenario | 1 | n | Partido | |
| Localidad | 1 | n | Boleto | |
| Boleto | | | Partido / Aficionado | Línea punteada hacia la relación Partido–Aficionado |
| Deporte | 1 | n | Deporte | Autorrelación (subdeportes) |
| Deporte | n | n | Equipo | Mediante `Equipo Deporte` |
| Equipo | n | n | Equipo | Autorrelación |
| Equipo | n | n | Partido | Línea punteada (?) |
| Equipo | n | n | Jugador | Mediante `Equipo Jugador` |
| Equipo | n | n | Aficionado | Mediante `Aficionado Equipo` |
| Jugador | n | n | Habilidad | Mediante `Habilidad Jugador` |
| Jugador | 1 | n | Anotación | |
| Jugador | 1 | n | Posición Espacial | |
| Anotación | n | 1 | Partido | |
| Partido | n | n | Aficionado | Mediante `Apuesta` |
| Partido | 1 | 1 | Pelota | (?) |
| Posición Espacial | n | 1 | Pelota | |
| Aficionado | n | n | Método Pago | Mediante `MétodoPago Aficionado` |
| Apuesta | n | 1 | MétodoPago Aficionado | |
