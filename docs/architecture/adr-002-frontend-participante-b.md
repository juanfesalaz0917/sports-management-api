# ADR 002: Arquitectura Frontend para Participante B

## Estado
Propuesto

## Contexto
El frontend existente en `mostro-sport-frontend` está construido sobre React 19, Vite, Tailwind CSS y React Router DOM v7. Cuenta con autenticación integrada y un cascarón `AppShell`. Es necesario incorporar los módulos de la Persona B con aislamiento estricto (Vertical Slicing), límite de 150 líneas por archivo y cliente HTTP nativo apuntando a `http://localhost:3000/api/v1`.

## Decisiones

1. **Cliente HTTP Dedicado para Negocio (`sportsHttpClient`)**:
   Se creará `src/core/http/sportsHttpClient.ts` que consumirá el microservicio de negocio en el puerto `3000` (`VITE_SPORTS_API_URL`), adjuntando automáticamente el token Bearer existente en `localStorage` y la cabecera `x-bypass-security: true` en modo desarrollo.

2. **Vertical Slicing Estricto**:
   Cada módulo de negocio de B tendrá su estructura independiente:
   - `domain/`: Interfaces tipadas de datos y respuestas.
   - `application/`: Servicios que realizan las llamadas API y transforman datos.
   - `infrastructure/`: Componentes React divididos de forma atómica para no exceder las 150 líneas.

3. **Pizarra Táctica Reactiva**:
   Se implementará la pizarra de seguimiento de partido (HU-GC-09) mediante un lienzo SVG/HTML responsive donde los jugadores de ambos equipos y la pelota se renderizan dinámicamente según las posiciones espaciales.

4. **Integración con Navegación (`AppShell.tsx`)**:
   Se añadirá una sección de menú "Gestión Deportiva (B)" en `AppShell.tsx` con enlaces a Partidos, Apuestas, Boletería, Aficionado y Torneos.
