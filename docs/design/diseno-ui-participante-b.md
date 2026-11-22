# Especificación de Diseño UI y Componentes (Participante B)

## 1. Mapeo de Vistas y Rutas

| Funcionalidad | Ruta Frontend | Componentes Clave (< 150 líneas) |
|---|---|---|
| Partidos | `/sports/partidos` | `PartidosListPage.tsx`, `PartidoFormModal.tsx`, `PartidosTable.tsx` |
| Marcador y Anotaciones | `/sports/partidos/:id/resultado` | `PartidoResultadoPage.tsx`, `AnotacionFormModal.tsx`, `AnotacionesList.tsx` |
| Pizarra Táctica (HU-GC-09) | `/sports/partidos/:id/pizarra` | `PizarraCampoPage.tsx`, `CampoDeportivoSvg.tsx`, `ControlesPizarra.tsx` |
| Desarrollo Torneo (HU-GC-08b) | `/sports/torneos/:id/desarrollo` | `TorneoDesarrolloPage.tsx`, `TablaClasificacion.tsx`, `FixtureFases.tsx` |
| Apuestas Deportivas (HU-GC-11) | `/sports/apuestas` | `ApuestasPage.tsx`, `NuevaApuestaModal.tsx`, `ApuestasTable.tsx` |
| Boletos y Localidades | `/sports/boletos` | `BoletosPage.tsx`, `ComprarBoletoModal.tsx`, `LocalidadesSelect.tsx` |
| Perfil Aficionado & Métodos Pago | `/sports/aficionado` | `AficionadoProfilePage.tsx`, `MetodosPagoSection.tsx`, `EquiposFavoritosSection.tsx` |
| Habilidades de Jugadores | `/sports/jugadores/:id/habilidades` | `JugadorHabilidadesPage.tsx`, `AsignarHabilidadModal.tsx` |

## 2. Tokens de Diseño y Experiencia de Usuario
- **Estilo Base**: Tailwind CSS consistente con el tema oscuro de la barra lateral (`slate-950`) y contenedores limpios (`bg-white shadow-sm border border-slate-200`).
- **Estados Explícitos**:
  - `LoadingSkeleton` durante la carga de peticiones HTTP.
  - Alertas `ErrorBanner` con feedback amigable cuando el backend responda `400` o `409`.
  - Badges de estado semánticos: `PROGRAMADO` (azul), `EN_CURSO` (ámbar), `FINALIZADO` (esmeralda), `CANCELADO` (rojo).
- **Pizarra Deportiva (HU-GC-09)**: Campo visual con coordenadas normalizadas `(x, y)` calculadas sobre dimensiones relativas en porcentaje (`left: x * 100%`, `top: y * 100%`).
