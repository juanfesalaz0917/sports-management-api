**Módulo Gestión Deportiva**

**HU-GD-01 – Gestionar deportes**

**Historia de usuario:**  
Como administrador deportivo, quiero gestionar la información de los deportes registrados en la plataforma, para mantener actualizadas las disciplinas disponibles para la organización de equipos y competencias. Es de tener presente que un deporte puede tener a su vez varios subdeportes, por ejemplo existe futbol, futbol callejero, futbol de salón, etc

**Criterios de aceptación:**

- El sistema debe permitir registrar un nuevo deporte con su información requerida.

- El sistema debe validar los campos obligatorios antes de realizar el registro.

- No se deben permitir deportes duplicados.

- El sistema debe permitir consultar el listado de deportes registrados.

- Se debe poder consultar el detalle de un deporte.

- Se debe permitir actualizar la información de un deporte existente.

- Se debe permitir eliminar o desactivar un deporte.

- Si el deporte tiene información asociada que impida su eliminación, el sistema debe informar al usuario.

- Los cambios realizados deben quedar almacenados correctamente.

**HU-GD-02 – Gestionar equipos**

**Historia de usuario:**  
Como administrador deportivo, quiero gestionar los equipos de la plataforma, para mantener organizada la información de las organizaciones que pueden participar en las diferentes competencias.

**Criterios de aceptación:**

- El sistema debe permitir registrar un equipo con su información básica.

- Los campos obligatorios deben ser validados.

- El sistema debe permitir consultar los equipos registrados.

- Se debe poder consultar la información detallada de un equipo.

- Se debe permitir actualizar la información del equipo.

- Se debe permitir eliminar o desactivar un equipo cuando las reglas del sistema lo permitan.

- Antes de eliminar un equipo, el sistema debe validar si posee información asociada.

- Los cambios realizados deben quedar almacenados correctamente.

**HU-GD-03 – Asociar equipos con deportes**

**Historia de usuario:**  
Como administrador deportivo, quiero asociar los equipos con los deportes en los que participan, para identificar las disciplinas deportivas en las que puede competir cada equipo.

**Criterios de aceptación:**

- Tanto el equipo como el deporte deben existir previamente.

- No se debe permitir registrar dos veces la misma asociación entre un equipo y un deporte.

- El sistema debe permitir consultar los deportes asociados a un equipo.

- El sistema debe permitir consultar los equipos asociados a un deporte.

- Se debe poder retirar una asociación sin eliminar el equipo ni el deporte del sistema.

**HU-GD-04 – Gestionar jugadores**

**Historia de usuario:**  
Como administrador deportivo, quiero gestionar la información de los jugadores, para mantener actualizado el registro de las personas que pueden integrar los diferentes equipos.

**Criterios de aceptación:**

- El sistema debe permitir registrar un jugador con su información requerida.

- Los campos obligatorios deben ser validados.

- No se deben permitir jugadores duplicados cuando exista un identificador único.

- El sistema debe permitir consultar los jugadores registrados.

- Se debe poder consultar el detalle de un jugador.

- Se debe permitir actualizar la información de un jugador.

- Se debe permitir eliminar o desactivar un jugador cuando las reglas del sistema lo permitan.

- La eliminación de un jugador debe validar previamente si tiene información asociada.

- Los cambios deben quedar almacenados correctamente.

**HU-GD-05 – Asignar jugadores a equipos**

**Historia de usuario:**  
Como administrador deportivo, quiero asignar jugadores a los equipos, para establecer la composición de cada plantilla deportiva.

**Criterios de aceptación:**

- Tanto el jugador como el equipo deben existir previamente.

- Se debe permitir asociar un jugador con un equipo definiendo la fecha de inicio y fin del contrato.

- Un equipo puede estar conformado por varios jugadores.

- El sistema debe evitar registrar dos veces la misma asociación.

- Se deben poder consultar los jugadores pertenecientes a un equipo.

- Se deben poder consultar los equipos asociados a un jugador.

- Se debe permitir retirar un jugador de un equipo sin eliminar su información del sistema.

- Al retirar la asociación, el jugador debe continuar disponible para ser asignado a otros equipos para que sirva como historial de traspasos

**HU-GD-06 – Gestionar habilidades**

**Historia de usuario:**  
Como administrador deportivo, quiero gestionar las habilidades deportivas disponibles en el sistema, para disponer de un catálogo de capacidades que puedan ser asignadas a los jugadores.

**Criterios de aceptación:**

- El sistema debe permitir registrar nuevas habilidades.

- Los campos requeridos deben ser validados.

- No se deben permitir habilidades duplicadas.

- El sistema debe permitir consultar las habilidades registradas.

- Se debe poder consultar el detalle de una habilidad.

- Se debe permitir actualizar la información de una habilidad.

- Se debe permitir eliminar una habilidad cuando no existan restricciones que lo impidan.

- Si la habilidad se encuentra asociada con jugadores, el sistema debe validar si puede ser eliminada.

**HU-GD-07 – Asignar habilidades a jugadores**

**Historia de usuario:**  
Como administrador deportivo, quiero asignar habilidades a los jugadores, para representar las capacidades deportivas que posee cada uno.

**Criterios de aceptación:**

- Tanto el jugador como la habilidad deben existir previamente.

- Un jugador puede tener una o varias habilidades.

- Una misma habilidad puede pertenecer a diferentes jugadores.

- No se debe permitir asignar dos veces la misma habilidad al mismo jugador.

- El sistema debe permitir consultar las habilidades asociadas a un jugador.

- Se debe permitir consultar los jugadores que poseen determinada habilidad.

- Se deben poder agregar o retirar habilidades de un jugador.

- Retirar una habilidad de un jugador no debe eliminar la habilidad del sistema.

**HU-GD-08 – Consultar perfil deportivo del jugador**

**Historia de usuario:**  
Como administrador deportivo, quiero consultar el perfil deportivo de un jugador, para conocer de manera centralizada su información, los equipos a los que pertenece y las habilidades que posee.

**Criterios de aceptación:**

- El sistema debe permitir seleccionar o buscar un jugador registrado.

- Se debe mostrar la información básica del jugador.

- Se deben mostrar los equipos con los que se encuentra asociado.

- Se deben mostrar las habilidades que tiene asignadas.

- Si el jugador no tiene equipos asociados, el sistema debe indicarlo.

- Si el jugador no tiene habilidades registradas, el sistema debe indicarlo.
