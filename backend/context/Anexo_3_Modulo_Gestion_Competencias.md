**HU-GC-01 – Gestionar torneos**

**Historia de usuario:**  
Como administrador deportivo, quiero gestionar los torneos de la plataforma, para organizar las diferentes competencias que se realizan para los deportes registrados.

**Criterios de aceptación:**

- El sistema debe permitir registrar un torneo con la información requerida.

- Cada torneo debe estar asociado con un deporte previamente registrado.

- Los campos obligatorios deben ser validados antes de guardar la información.

- El sistema debe permitir consultar los torneos registrados.

- Se debe poder consultar la información detallada de un torneo.

- Se debe permitir actualizar la información de un torneo existente.

- Se debe permitir eliminar o desactivar un torneo cuando las reglas del sistema lo permitan.

- Antes de eliminar un torneo, se debe validar si posee fases, partidos u otra información asociada.

- Los cambios realizados deben quedar almacenados correctamente.

**HU-GC-08 – Gestionar inscripciones de equipos en torneos**

**Historia de usuario:**  
Como administrador deportivo, quiero gestionar la inscripción de equipos en los diferentes torneos, para definir cuáles equipos participarán en cada competencia.

**Criterios de aceptación:**

- El torneo debe estar previamente registrado en el sistema.

- El equipo debe estar previamente registrado en el sistema.

- El equipo debe estar asociado con el deporte correspondiente al torneo.

- El sistema debe permitir inscribir uno o varios equipos en un torneo.

- Un mismo equipo puede estar inscrito en diferentes torneos.

- Un torneo puede contar con varios equipos inscritos.

- No se debe permitir registrar dos veces al mismo equipo en el mismo torneo.

- El sistema debe permitir consultar los equipos inscritos en un torneo.

- El sistema debe permitir consultar los torneos en los que se encuentra inscrito un equipo.

- Se debe permitir retirar la inscripción de un equipo mientras las reglas o el estado del torneo lo permitan.

- Retirar una inscripción no debe eliminar el equipo ni el torneo del sistema.

- La información de la inscripción debe quedar asociada al equipo y al torneo correspondientes.

- Si el torneo ya inició o el periodo de inscripciones se encuentra cerrado, el sistema debe impedir nuevas inscripciones o retiros cuando corresponda.

- El sistema debe informar al usuario cuando una inscripción se haya realizado o retirado correctamente.

**HU-GC-03 – Gestionar fases de un torneo**

**Historia de usuario:**  
Como administrador deportivo, quiero gestionar las fases que conforman un torneo, para definir las diferentes etapas mediante las cuales se desarrollará la competencia.

**Criterios de aceptación:**

- El torneo debe existir previamente en el sistema.

- El sistema debe permitir registrar una o varias fases para un torneo.

- Cada fase debe estar asociada con un único torneo.

- Se debe permitir consultar las fases correspondientes a un torneo.

- Se debe poder actualizar la información de una fase.

- Se debe permitir eliminar una fase cuando no tenga información asociada que lo impida.

- El sistema debe permitir definir el orden en el que se desarrollarán las fases.

- Cada fase debe corresponder al tipo de etapa definido para la competencia, como una fase de grupos o una fase final.

- No se debe eliminar el torneo al modificar o eliminar una de sus fases.

**HU-GC-04 – Gestionar grupos de competencia**

**Historia de usuario:**  
Como administrador deportivo, quiero gestionar los grupos pertenecientes a una fase de un torneo, para organizar los equipos que competirán durante esta etapa.

**Criterios de aceptación:**

- Debe existir previamente un torneo y una fase correspondiente.

- El sistema debe permitir registrar los grupos necesarios para la fase.

- Se debe poder consultar la información de los grupos registrados.

- Se debe permitir modificar la información de un grupo.

- Se debe permitir eliminar un grupo cuando las reglas de la competencia lo permitan.

- El sistema debe permitir asignar varios equipos a un grupo.

- Un grupo debe poder contener varios equipos.

- No se debe permitir registrar dos veces el mismo equipo dentro del mismo grupo.

- Un equipo no debe quedar asignado simultáneamente a diferentes grupos de la misma fase.

- Se deben poder consultar los equipos que conforman cada grupo.

- La eliminación de un grupo no debe eliminar los equipos registrados en la plataforma.

**HU-GC-05 – Gestionar fases finales**

**Historia de usuario:**  
Como administrador deportivo, quiero gestionar las fases finales de un torneo, para organizar las etapas decisivas de la competencia.

**Criterios de aceptación:**

- El torneo debe existir previamente.

- El sistema debe permitir registrar una fase final dentro de la estructura del torneo.

- Se debe poder consultar la información correspondiente a la fase final.

- Se debe permitir actualizar su información mientras las reglas de la competencia lo permitan.

- Se debe permitir eliminar una fase final cuando no tenga partidos u otra información asociada que lo impida.

- Los partidos correspondientes a esta etapa deben poder identificarse como parte de la fase final.

- La modificación de la fase final no debe afectar la información de las demás fases del torneo.

**HU-GC-06 – Gestionar partidos**

**Historia de usuario:**  
Como administrador deportivo, quiero gestionar los partidos de las diferentes fases de un torneo, para organizar y controlar los encuentros que conforman la competencia.

**Criterios de aceptación:**

- El torneo y la fase correspondiente deben existir previamente.

- El sistema debe permitir registrar un nuevo partido con la información requerida.

- Cada partido debe estar asociado con una fase de la competencia.

- El sistema debe permitir definir los equipos que participarán en el partido.

- No se debe permitir que un equipo compita contra sí mismo.

- Los equipos seleccionados deben encontrarse habilitados para participar en la competencia.

- El sistema debe permitir consultar los partidos registrados.

- Se debe poder consultar la información detallada de cada partido.

- Se debe permitir actualizar la información de un partido cuando su estado lo permita.

- Se debe permitir eliminar un partido cuando no tenga información asociada que lo impida.

- Cuando corresponda, se debe poder asociar el partido con el escenario en el que será disputado.

- Los cambios realizados deben quedar almacenados correctamente.

- Se debe enviar un correo electrónico cuando se cree un partido a los aficionados que han participado en partidos anteriores a los equipos enfrentados

**HU-GC-07 – Gestionar resultados y anotaciones de los partidos**

**Historia de usuario:**  
Como administrador deportivo, quiero gestionar los resultados y las anotaciones realizadas durante un partido, para mantener actualizado el desarrollo de la competencia y conservar el registro de los acontecimientos relevantes del encuentro.

**Criterios de aceptación:**

- El partido debe estar previamente registrado en el sistema.

- El sistema debe permitir registrar el resultado correspondiente a los equipos participantes.

- Solo se deben poder registrar resultados para los equipos que participan en el partido.

- El sistema debe permitir consultar y modificar el resultado del encuentro cuando las reglas de la competencia lo permitan.

- El resultado debe quedar asociado con el partido correspondiente.

- El sistema debe permitir registrar una o varias anotaciones asociadas con el partido.

- Cada anotación debe estar asociada con el jugador que la realizó.

- El jugador seleccionado para una anotación debe pertenecer a uno de los equipos participantes del partido.

- El sistema debe permitir consultar, modificar y eliminar las anotaciones registradas.

- Eliminar una anotación no debe eliminar al jugador ni al partido asociado.

- Las anotaciones deben conservar su relación con el partido y con el jugador correspondiente.

- Cuando se registre una anotación, el sistema debe enviar una notificación a los aficionados que hayan adquirido un boleto para el partido o realizado una apuesta sobre este.

- Al finalizar y registrar el resultado del partido, el sistema debe enviar una notificación con el resumen del encuentro a los aficionados que hayan adquirido un boleto o realizado una apuesta sobre el partido.

**HU-GC-08 – Consultar desarrollo de un torneo**

**Historia de usuario:**  
Como administrador deportivo, quiero consultar la estructura y el desarrollo de un torneo, para conocer de manera centralizada el estado de la competencia.

**Criterios de aceptación:**

- El sistema debe permitir seleccionar un torneo registrado.

- Se debe mostrar la información general del torneo.

- Se deben mostrar las fases que conforman la competencia.

- En las fases de grupos se deben mostrar los grupos y los equipos que los conforman.

  - Si son grupos la tabla de posiciones

  - Si es fase final a manera de llaves

- Se deben mostrar los partidos asociados con cada fase.

- Se debe indicar cuáles partidos tienen resultados registrados y cuáles están pendientes.

- Se deben poder consultar las anotaciones correspondientes a cada partido.

- La información presentada debe corresponder únicamente al torneo seleccionado.

**HU-GC-09 – Realizar seguimiento deportivo del partido**

**Historia de usuario:**  
Como administrador deportivo e hincha, quiero visualizar y actualizar la posición de los jugadores y de la pelota sobre una representación gráfica del campo de juego, para realizar seguimiento espacial al desarrollo de un partido.

**Criterios de aceptación:**

- El partido debe estar previamente registrado en el sistema.

- El sistema debe permitir acceder a una pizarra que represente gráficamente el espacio de juego correspondiente al deporte.

- En la pizarra se deben visualizar los jugadores que participan en el partido.

- Cada jugador debe poder ser identificado visualmente dentro de la pizarra.

- El sistema debe diferenciar los jugadores de cada equipo participante.

- La pelota debe visualizarse de manera independiente de los jugadores.

- El sistema debe permitir registrar y actualizar la posición espacial de cada jugador dentro del campo de juego (desde un script que simula posiciones).

- El sistema debe permitir registrar y actualizar la posición espacial de la pelota (desde un script que simula posiciones).

- Cuando cambie la posición de un jugador, su ubicación debe actualizarse en la pizarra.

- Cuando cambie la posición de la pelota, su ubicación debe actualizarse en la pizarra.

- Las posiciones registradas deben estar asociadas con el partido correspondiente.

- Cada registro de posición debe permitir identificar a qué jugador o pelota pertenece.

- El sistema debe conservar los registros de posición necesarios para representar el seguimiento realizado durante el partido.

- Solo se deben mostrar en la pizarra los jugadores que participan en el encuentro seleccionado.

- La pelota mostrada debe corresponder a la utilizada en el partido.

- La finalización del seguimiento no debe eliminar la información del partido, los jugadores ni la pelota.

**HU-GC-10 – Gestionar métodos de pago**

**Historia de usuario:**  
Como aficionado, quiero gestionar mis métodos de pago, para disponer de diferentes opciones al momento de realizar operaciones dentro de la plataforma.

**Criterios de aceptación:**

- El aficionado debe estar previamente registrado en el sistema.

- El sistema debe permitir registrar uno o varios métodos de pago para un aficionado.

- Cada método de pago debe quedar asociado con el aficionado correspondiente.

- El sistema debe permitir consultar los métodos de pago registrados por el aficionado.

- Se debe permitir actualizar la información de un método de pago cuando corresponda.

- Se debe permitir eliminar o desactivar un método de pago cuando no existan restricciones que lo impidan.

- El sistema debe validar los datos obligatorios según el tipo de método de pago registrado.

- No se debe permitir utilizar un método de pago que no pertenezca al aficionado.

- La eliminación de un método de pago no debe eliminar las operaciones realizadas previamente con dicho método.

- Los cambios realizados deben quedar almacenados correctamente.

**HU-GC-11 – Gestionar apuestas sobre partidos**

**Historia de usuario:**  
Como aficionado, quiero realizar apuestas sobre los partidos disponibles utilizando uno de mis métodos de pago y consultar posteriormente su liquidación, para conocer el resultado de mi apuesta y el valor correspondiente en caso de resultar ganadora.

**Criterios de aceptación:**

- El aficionado debe estar previamente registrado en el sistema.

- El partido debe estar previamente registrado y habilitado para recibir apuestas.

- El sistema debe permitir consultar los partidos disponibles para apostar.

- El aficionado debe poder seleccionar el partido sobre el cual desea realizar la apuesta.

- El sistema debe permitir registrar la selección realizada, el valor apostado y la cuota correspondiente.

- La apuesta debe quedar asociada con el aficionado y el partido seleccionados.

- El aficionado debe seleccionar uno de sus métodos de pago registrados para realizar la apuesta.

- No se debe permitir utilizar un método de pago perteneciente a otro aficionado.

- El sistema debe validar que el valor de la apuesta cumpla con las condiciones establecidas.

- No se deben permitir nuevas apuestas cuando el partido haya iniciado o cuando las apuestas se encuentren cerradas.

- La cuota de la apuesta debe quedar almacenada al momento de realizarla y no debe modificarse posteriormente.

- El aficionado debe poder consultar las apuestas realizadas y el estado de cada una.

- El administrador deportivo debe poder consultar las apuestas realizadas sobre un partido.

- Una apuesta registrada no debe poder modificarse después de que el partido haya iniciado.

- La cancelación de una apuesta solo debe permitirse cuando las reglas establecidas lo permitan.

- La apuesta solo debe poder liquidarse cuando el partido haya finalizado y tenga un resultado oficial registrado.

- Al finalizar el partido, el sistema debe comparar la selección realizada por el aficionado con el resultado oficial.

- Si la selección coincide con el resultado correspondiente, la apuesta debe quedar en estado **ganada**.

- Si la selección no coincide con el resultado correspondiente, la apuesta debe quedar en estado **perdida**.

- Si el partido es cancelado o se presenta una condición que invalide la apuesta, esta debe quedar en estado **anulada**, según las reglas establecidas.

- Para una apuesta ganadora, el sistema debe calcular el valor a pagar mediante la fórmula: **valor apostado × cuota**.

- Para una apuesta perdida, el valor a pagar debe ser cero.

- Para una apuesta anulada, se debe devolver al aficionado el valor originalmente apostado.

- La liquidación debe realizarse utilizando la cuota registrada al momento de realizar la apuesta.

- Una misma apuesta no debe poder liquidarse más de una vez.

- Una vez liquidada, el sistema debe almacenar el estado final y el valor pagado o devuelto.

- El aficionado debe poder consultar el resultado y la liquidación de sus apuestas.

- El sistema debe notificar al aficionado cuando una apuesta sea registrada y cuando sea liquidada.
