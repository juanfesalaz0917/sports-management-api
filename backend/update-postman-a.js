/**
 * Genera la colección Postman del Integrante A:
 *   ../postman/sports-management-api-participante-a.postman_collection.json
 *
 * Uso (desde backend/):  node update-postman-a.js
 *
 * La colección está pensada para ejecutarse COMPLETA y en orden con el Collection Runner:
 * cada carpeta crea los datos que necesita la siguiente (los ids se guardan en variables de
 * colección) y la carpeta final limpia lo creado. Se puede volver a ejecutar sin choques porque
 * los nombres/documentos llevan un sufijo {{runId}} nuevo en cada corrida.
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(
  __dirname,
  '..',
  'postman',
  'sports-management-api-participante-a.postman_collection.json',
);

// ---------- helpers ----------

/** Convierte "{{baseUrl}}/deportes?x=1" al objeto url de Postman. */
function url(raw) {
  const [pathPart, query] = raw.split('?');
  const segments = pathPart.replace('{{baseUrl}}/', '').split('/');
  const u = { raw, host: ['{{baseUrl}}'], path: segments };
  if (query) {
    u.query = query.split('&').map((q) => {
      const [key, value] = q.split('=');
      return { key, value };
    });
  }
  return u;
}

/**
 * @param {string} name
 * @param {string} method
 * @param {string} rawUrl
 * @param {object|null} body
 * @param {number} status  código HTTP esperado
 * @param {string[]} tests  líneas de JS extra para la pestaña Tests
 * @param {string} description
 */
function req(name, method, rawUrl, body, status, tests = [], description = '') {
  const item = {
    name,
    request: {
      method,
      header: [{ key: 'Content-Type', value: 'application/json' }],
      url: url(rawUrl),
      description,
    },
    event: [
      {
        listen: 'test',
        script: {
          type: 'text/javascript',
          exec: [
            `pm.test('Status code es ${status}', function () { pm.response.to.have.status(${status}); });`,
            ...tests,
          ],
        },
      },
    ],
  };
  if (body !== null && body !== undefined) {
    item.request.body = {
      mode: 'raw',
      raw: typeof body === 'string' ? body : JSON.stringify(body, null, 2),
      options: { raw: { language: 'json' } },
    };
  }
  return item;
}

/** Guarda en una variable de colección un campo del JSON de respuesta. */
const save = (variable, field = 'id') =>
  `pm.collectionVariables.set('${variable}', pm.response.json().${field});`;

/** Verifica el formato único de error { timestamp, status, error, message, path }. */
const errorFormat = [
  "pm.test('Formato de error unico', function () {",
  '  const j = pm.response.json();',
  "  pm.expect(j).to.have.property('timestamp');",
  "  pm.expect(j).to.have.property('status');",
  "  pm.expect(j).to.have.property('message');",
  "  pm.expect(j).to.have.property('path');",
  '});',
];

const isPage = [
  "pm.test('Respuesta paginada { content, totalElements }', function () {",
  '  const j = pm.response.json();',
  '  pm.expect(j.content).to.be.an("array");',
  '  pm.expect(j.totalElements).to.be.a("number");',
  '});',
];

const folder = (name, description, item) => ({ name, description, item });

// ---------- carpetas ----------

const prep = folder(
  '00. Preparación',
  'Genera {{runId}} y las fechas de la corrida. EJECUTAR SIEMPRE PRIMERO. Requiere ms_negocio levantado con DEV_SECURITY_BYPASS=true (o un token válido en {{token}}).',
  [
    {
      name: 'Inicializar corrida (runId y fechas)',
      event: [
        {
          listen: 'prerequest',
          script: {
            type: 'text/javascript',
            exec: [
              "const iso = (d) => d.toISOString().slice(0, 10);",
              "const sumar = (dias) => { const d = new Date(); d.setUTCDate(d.getUTCDate() + dias); return iso(d); };",
              "pm.collectionVariables.set('runId', String(Date.now()).slice(-7));",
              "pm.collectionVariables.set('hoy', iso(new Date()));",
              "pm.collectionVariables.set('manana', sumar(1));",
              "pm.collectionVariables.set('ayer', sumar(-1));",
              "pm.collectionVariables.set('fechaCierre', sumar(30));",
              "pm.collectionVariables.set('fechaInicio', sumar(60));",
              "pm.collectionVariables.set('fechaFin', sumar(90));",
              "pm.collectionVariables.set('fechaFutura', sumar(400));",
            ],
          },
        },
        {
          listen: 'test',
          script: {
            type: 'text/javascript',
            exec: [
              "pm.test('Status code es 200', function () { pm.response.to.have.status(200); });",
              ...isPage,
            ],
          },
        },
      ],
      request: {
        method: 'GET',
        header: [],
        url: url('{{baseUrl}}/deportes?page=0&size=1'),
        description: 'Comprueba que el microservicio responde y fija las variables de la corrida.',
      },
    },
  ],
);

const deportes = folder(
  '01. Deportes (HU-GD-01)',
  'CRUD de deportes con subdeportes (autorrelación). Reglas: nombre único dentro del mismo padre, sin ciclos, no eliminar/desactivar con subdeportes, equipos o torneos asociados (409).',
  [
    req('Crear deporte raíz', 'POST', '{{baseUrl}}/deportes',
      { nombre: 'Fútbol {{runId}}', descripcion: 'Deporte raíz de la corrida' }, 201,
      [save('deporteId'), "pm.test('Deporte activo y sin padre', function () { const j = pm.response.json(); pm.expect(j.activo).to.eql(true); pm.expect(j.deportePadreId).to.eql(null); });"]),
    req('Crear subdeporte', 'POST', '{{baseUrl}}/deportes',
      { nombre: 'Fútbol de salón {{runId}}', deportePadreId: '{{deporteId}}' }, 201,
      [save('subdeporteId'), "pm.test('Padre correcto', function () { pm.expect(pm.response.json().deportePadreId).to.eql(Number(pm.collectionVariables.get('deporteId'))); });"]),
    req('Crear deporte con nombre repetido → 409', 'POST', '{{baseUrl}}/deportes',
      { nombre: 'Fútbol {{runId}}' }, 409, errorFormat),
    req('Crear deporte sin nombre → 400', 'POST', '{{baseUrl}}/deportes',
      { descripcion: 'sin nombre' }, 400, errorFormat),
    req('Crear subdeporte con padre inexistente → 404', 'POST', '{{baseUrl}}/deportes',
      { nombre: 'Huérfano {{runId}}', deportePadreId: 999999 }, 404, errorFormat),
    req('Listar deportes (paginado)', 'GET', '{{baseUrl}}/deportes?page=0&size=10&nombre={{runId}}', null, 200,
      [...isPage, "pm.test('Incluye los de la corrida', function () { pm.expect(pm.response.json().totalElements).to.be.at.least(2); });"]),
    req('Listar solo deportes raíz', 'GET', '{{baseUrl}}/deportes?soloRaiz=true&nombre={{runId}}', null, 200,
      [...isPage, "pm.test('Todos son raíz', function () { pm.response.json().content.forEach(d => pm.expect(d.deportePadreId).to.eql(null)); });"]),
    req('Listar con page inválido → 400', 'GET', '{{baseUrl}}/deportes?page=-1', null, 400, errorFormat),
    req('Obtener deporte por id', 'GET', '{{baseUrl}}/deportes/{{deporteId}}', null, 200,
      ["pm.test('Es el deporte creado', function () { pm.expect(pm.response.json().id).to.eql(Number(pm.collectionVariables.get('deporteId'))); });"]),
    req('Obtener deporte inexistente → 404', 'GET', '{{baseUrl}}/deportes/999999', null, 404, errorFormat),
    req('Listar subdeportes', 'GET', '{{baseUrl}}/deportes/{{deporteId}}/subdeportes', null, 200,
      ["pm.test('Contiene el subdeporte', function () { pm.expect(pm.response.json().length).to.be.at.least(1); });"]),
    req('Actualizar deporte', 'PUT', '{{baseUrl}}/deportes/{{deporteId}}',
      { descripcion: 'Descripción actualizada' }, 200,
      ["pm.test('Descripción actualizada', function () { pm.expect(pm.response.json().descripcion).to.eql('Descripción actualizada'); });"]),
    req('Ciclo en jerarquía (padre = su propio subdeporte) → 400', 'PUT', '{{baseUrl}}/deportes/{{deporteId}}',
      { deportePadreId: '{{subdeporteId}}' }, 400, errorFormat),
    req('Deporte como su propio padre → 400', 'PUT', '{{baseUrl}}/deportes/{{deporteId}}',
      { deportePadreId: '{{deporteId}}' }, 400, errorFormat),
    req('Desactivar deporte con subdeportes → 409', 'PATCH', '{{baseUrl}}/deportes/{{deporteId}}/estado',
      { activo: false }, 409, errorFormat),
    req('Eliminar deporte con subdeportes → 409', 'DELETE', '{{baseUrl}}/deportes/{{deporteId}}', null, 409, errorFormat),
    req('Estado con valor inválido → 400', 'PATCH', '{{baseUrl}}/deportes/{{subdeporteId}}/estado',
      { activo: 'quizas' }, 400, errorFormat),
  ],
);

const equipos = folder(
  '02. Equipos (HU-GD-02)',
  'CRUD de equipos. Un mismo nombre puede existir en modalidades distintas (MASCULINO/FEMENINO/MIXTO). Eliminar valida jugadores, deportes, inscripciones, grupos y partidos (409); alternativa: desactivar.',
  [
    req('Crear equipo 1 (masculino)', 'POST', '{{baseUrl}}/equipos',
      { nombre: 'Real Prueba {{runId}}', genero: 'MASCULINO', fechaCreacion: '1902-03-06' }, 201, [save('equipoId')]),
    req('Crear mismo nombre en modalidad FEMENINO (permitido)', 'POST', '{{baseUrl}}/equipos',
      { nombre: 'Real Prueba {{runId}}', genero: 'FEMENINO' }, 201, [save('equipoFemId')]),
    req('Crear equipo 2', 'POST', '{{baseUrl}}/equipos',
      { nombre: 'Atlético Prueba {{runId}}', genero: 'MASCULINO' }, 201, [save('equipo2Id')]),
    req('Crear equipo 3 (sin deporte asociado)', 'POST', '{{baseUrl}}/equipos',
      { nombre: 'Sin Deporte {{runId}}' }, 201, [save('equipo3Id')]),
    req('Crear equipo duplicado (mismo nombre y modalidad) → 409', 'POST', '{{baseUrl}}/equipos',
      { nombre: 'Real Prueba {{runId}}', genero: 'MASCULINO' }, 409, errorFormat),
    req('Crear equipo con género inválido → 400', 'POST', '{{baseUrl}}/equipos',
      { nombre: 'X {{runId}}', genero: 'ROBOT' }, 400, errorFormat),
    req('Crear equipo sin nombre → 400', 'POST', '{{baseUrl}}/equipos', {}, 400, errorFormat),
    req('Listar equipos (paginado y filtrado)', 'GET', '{{baseUrl}}/equipos?page=0&size=10&nombre={{runId}}', null, 200, isPage),
    req('Obtener equipo', 'GET', '{{baseUrl}}/equipos/{{equipoId}}', null, 200),
    req('Obtener equipo inexistente → 404', 'GET', '{{baseUrl}}/equipos/999999', null, 404, errorFormat),
    req('Actualizar equipo', 'PUT', '{{baseUrl}}/equipos/{{equipoId}}',
      { fechaCreacion: '1902-03-06' }, 200),
    req('Actualizar a nombre/modalidad ya existente → 409', 'PUT', '{{baseUrl}}/equipos/{{equipoFemId}}',
      { genero: 'MASCULINO' }, 409, errorFormat),
  ],
);

const equiposDeportes = folder(
  '03. Equipo–Deporte (HU-GD-03)',
  'Asociación n:n. Sin repetir (409); quitar la asociación no borra equipo ni deporte; consulta en ambos sentidos.',
  [
    req('Asociar equipo 1 al deporte', 'POST', '{{baseUrl}}/equipos/{{equipoId}}/deportes/{{deporteId}}', null, 201),
    req('Asociar equipo 2 al deporte', 'POST', '{{baseUrl}}/equipos/{{equipo2Id}}/deportes/{{deporteId}}', null, 201),
    req('Asociar equipo 1 al subdeporte', 'POST', '{{baseUrl}}/equipos/{{equipoId}}/deportes/{{subdeporteId}}', null, 201),
    req('Asociación repetida → 409', 'POST', '{{baseUrl}}/equipos/{{equipoId}}/deportes/{{deporteId}}', null, 409, errorFormat),
    req('Asociar con equipo inexistente → 404', 'POST', '{{baseUrl}}/equipos/999999/deportes/{{deporteId}}', null, 404, errorFormat),
    req('Asociar con deporte inexistente → 404', 'POST', '{{baseUrl}}/equipos/{{equipoId}}/deportes/999999', null, 404, errorFormat),
    req('Deportes de un equipo', 'GET', '{{baseUrl}}/equipos/{{equipoId}}/deportes', null, 200,
      ["pm.test('Tiene 2 deportes', function () { pm.expect(pm.response.json().length).to.eql(2); });"]),
    req('Equipos de un deporte', 'GET', '{{baseUrl}}/deportes/{{deporteId}}/equipos', null, 200,
      ["pm.test('Tiene 2 equipos', function () { pm.expect(pm.response.json().length).to.eql(2); });"]),
    req('Quitar asociación inexistente → 404', 'DELETE', '{{baseUrl}}/equipos/{{equipo3Id}}/deportes/{{deporteId}}', null, 404, errorFormat),
    req('Quitar asociación del subdeporte', 'DELETE', '{{baseUrl}}/equipos/{{equipoId}}/deportes/{{subdeporteId}}', null, 200,
      ["pm.test('El equipo sigue existiendo', function () { pm.expect(pm.response.json().message).to.be.a('string'); });"]),
    req('Eliminar deporte con equipos asociados → 409', 'DELETE', '{{baseUrl}}/deportes/{{deporteId}}', null, 409, errorFormat,
      'El deporte raíz tiene subdeportes y equipos asociados.'),
  ],
);

const jugadores = folder(
  '04. Jugadores (HU-GD-04)',
  'CRUD de jugadores. El documento es único. La posición debe existir (catálogo de B). Eliminar valida vínculos con equipos y anotaciones (409).',
  [
    req('Crear jugador', 'POST', '{{baseUrl}}/jugadores',
      { nombre: 'Juan', apellido: 'Prueba', documento: 'DOC{{runId}}', fechaNacimiento: '1998-05-20' }, 201,
      [save('jugadorId')]),
    req('Crear segundo jugador', 'POST', '{{baseUrl}}/jugadores',
      { nombre: 'Pedro', apellido: 'Prueba', documento: 'DOC{{runId}}B' }, 201, [save('jugador2Id')]),
    req('Crear jugador con documento repetido → 409', 'POST', '{{baseUrl}}/jugadores',
      { nombre: 'Otro', documento: 'DOC{{runId}}' }, 409, errorFormat),
    req('Crear jugador sin documento → 400', 'POST', '{{baseUrl}}/jugadores',
      { nombre: 'Sin documento' }, 400, errorFormat),
    req('Crear jugador con fecha de nacimiento futura → 400', 'POST', '{{baseUrl}}/jugadores',
      { nombre: 'Futuro', documento: 'FUT{{runId}}', fechaNacimiento: '{{fechaFutura}}' }, 400, errorFormat),
    req('Crear jugador con posición inexistente → 404', 'POST', '{{baseUrl}}/jugadores',
      { nombre: 'Sin posición', documento: 'POS{{runId}}', posicionId: 999999 }, 404, errorFormat),
    req('Listar jugadores (paginado)', 'GET', '{{baseUrl}}/jugadores?page=0&size=10&documento=DOC{{runId}}', null, 200,
      [...isPage, "pm.test('Dos jugadores de la corrida', function () { pm.expect(pm.response.json().totalElements).to.eql(2); });"]),
    req('Obtener jugador', 'GET', '{{baseUrl}}/jugadores/{{jugadorId}}', null, 200),
    req('Obtener jugador inexistente → 404', 'GET', '{{baseUrl}}/jugadores/999999', null, 404, errorFormat),
    req('Actualizar jugador', 'PUT', '{{baseUrl}}/jugadores/{{jugadorId}}', { apellido: 'Actualizado' }, 200,
      ["pm.test('Apellido actualizado', function () { pm.expect(pm.response.json().apellido).to.eql('Actualizado'); });"]),
    req('Actualizar con documento de otro jugador → 409', 'PUT', '{{baseUrl}}/jugadores/{{jugador2Id}}',
      { documento: 'DOC{{runId}}' }, 409, errorFormat),
    req('Perfil sin equipos (HU-GD-08: mensaje explícito)', 'GET', '{{baseUrl}}/jugadores/{{jugadorId}}/perfil', null, 200,
      ["pm.test('Mensajes de perfil vacío', function () { const j = pm.response.json(); pm.expect(j.equipos).to.eql([]); pm.expect(j.mensajeEquipos).to.be.a('string'); pm.expect(j.mensajeHabilidades).to.be.a('string'); });"]),
    req('Perfil de jugador inexistente → 404', 'GET', '{{baseUrl}}/jugadores/999999/perfil', null, 404, errorFormat),
  ],
);

const equiposJugadores = folder(
  '05. Equipo–Jugador / historial (HU-GD-05)',
  'Historial de traspasos. Retirar = cerrar el vínculo con fechaFin (nunca se borra). fechaFin es exclusiva: un jugador retirado hoy ya no es vigente. No se permiten dos periodos solapados del mismo jugador en el mismo equipo.',
  [
    req('Vincular jugador al equipo 1', 'POST', '{{baseUrl}}/equipos/{{equipoId}}/jugadores',
      { jugadorId: '{{jugadorId}}', fechaInicio: '{{hoy}}' }, 201,
      [save('vinculoId'), "pm.test('Vínculo vigente', function () { pm.expect(pm.response.json().vigente).to.eql(true); });"]),
    req('Vincular al mismo equipo mientras está vigente → 409', 'POST', '{{baseUrl}}/equipos/{{equipoId}}/jugadores',
      { jugadorId: '{{jugadorId}}' }, 409, errorFormat),
    req('Vincular con fechaFin anterior a fechaInicio → 400', 'POST', '{{baseUrl}}/equipos/{{equipo2Id}}/jugadores',
      { jugadorId: '{{jugadorId}}', fechaInicio: '{{hoy}}', fechaFin: '{{ayer}}' }, 400, errorFormat),
    req('Vincular jugador inexistente → 404', 'POST', '{{baseUrl}}/equipos/{{equipoId}}/jugadores',
      { jugadorId: 999999 }, 404, errorFormat),
    req('Vincular con fecha mal formada → 400', 'POST', '{{baseUrl}}/equipos/{{equipoId}}/jugadores',
      { jugadorId: '{{jugador2Id}}', fechaInicio: 'ayer' }, 400, errorFormat),
    req('Vincular el mismo jugador a otro equipo (simultáneo permitido)', 'POST', '{{baseUrl}}/equipos/{{equipo2Id}}/jugadores',
      { jugadorId: '{{jugadorId}}' }, 201),
    req('Jugadores vigentes de un equipo (contrato para B)', 'GET', '{{baseUrl}}/equipos/{{equipoId}}/jugadores?vigentes=true', null, 200,
      ["pm.test('Hay un jugador vigente', function () { const l = pm.response.json(); pm.expect(l.length).to.eql(1); pm.expect(l[0].vigente).to.eql(true); });"]),
    req('Equipos de un jugador', 'GET', '{{baseUrl}}/jugadores/{{jugadorId}}/equipos', null, 200,
      ["pm.test('Pasó por 2 equipos', function () { pm.expect(pm.response.json().length).to.eql(2); });"]),
    req('Actualizar fechas del vínculo vigente', 'PUT', '{{baseUrl}}/equipos/{{equipoId}}/jugadores/{{jugadorId}}',
      { fechaFin: '{{fechaFin}}' }, 200,
      ["pm.test('fechaFin guardada', function () { pm.expect(pm.response.json().fechaFin).to.eql(pm.collectionVariables.get('fechaFin')); });"]),
    req('Perfil con equipos', 'GET', '{{baseUrl}}/jugadores/{{jugadorId}}/perfil', null, 200,
      ["pm.test('Perfil con 2 equipos', function () { const j = pm.response.json(); pm.expect(j.equipos.length).to.eql(2); pm.expect(j.mensajeEquipos).to.eql(undefined); });"]),
    req('Retirar jugador del equipo 1 (cierra el vínculo)', 'DELETE', '{{baseUrl}}/equipos/{{equipoId}}/jugadores/{{jugadorId}}', null, 200,
      ["pm.test('Vínculo cerrado, no vigente', function () { const j = pm.response.json(); pm.expect(j.vigente).to.eql(false); pm.expect(j.fechaFin).to.eql(pm.collectionVariables.get('hoy')); });"]),
    req('Retirar de nuevo (ya no hay vínculo vigente) → 404', 'DELETE', '{{baseUrl}}/equipos/{{equipoId}}/jugadores/{{jugadorId}}', null, 404, errorFormat),
    req('El historial se conserva tras el retiro', 'GET', '{{baseUrl}}/jugadores/{{jugadorId}}/equipos?vigentes=false', null, 200,
      ["pm.test('Aparece el vínculo histórico', function () { pm.expect(pm.response.json().length).to.be.at.least(1); });"]),
    req('Reingreso al mismo equipo (nuevo periodo)', 'POST', '{{baseUrl}}/equipos/{{equipoId}}/jugadores',
      { jugadorId: '{{jugadorId}}', fechaInicio: '{{hoy}}' }, 201),
    req('Eliminar jugador con vínculos → 409', 'DELETE', '{{baseUrl}}/jugadores/{{jugadorId}}', null, 409, errorFormat),
    req('Eliminar equipo con jugadores → 409', 'DELETE', '{{baseUrl}}/equipos/{{equipoId}}', null, 409, errorFormat),
  ],
);

const escenarios = folder(
  '06. Escenarios (jerarquía)',
  'Escenarios con jerarquía complejo → espacios. Nombre único por padre, sin ciclos; eliminar valida espacios, localidades, partidos y torneos (409).',
  [
    req('Crear escenario (complejo)', 'POST', '{{baseUrl}}/escenarios',
      { nombre: 'Complejo {{runId}}', direccion: 'Calle 1 # 2-3' }, 201, [save('escenarioId')]),
    req('Crear espacio dentro del complejo', 'POST', '{{baseUrl}}/escenarios/{{escenarioId}}/subescenarios',
      { nombre: 'Cancha 1 {{runId}}' }, 201,
      [save('subescenarioId'), "pm.test('Padre correcto', function () { pm.expect(pm.response.json().escenarioPadreId).to.eql(Number(pm.collectionVariables.get('escenarioId'))); });"]),
    req('Crear espacio duplicado → 409', 'POST', '{{baseUrl}}/escenarios/{{escenarioId}}/subescenarios',
      { nombre: 'Cancha 1 {{runId}}' }, 409, errorFormat),
    req('Crear escenario sin nombre → 400', 'POST', '{{baseUrl}}/escenarios', {}, 400, errorFormat),
    req('Crear espacio en padre inexistente → 404', 'POST', '{{baseUrl}}/escenarios/999999/subescenarios',
      { nombre: 'X {{runId}}' }, 404, errorFormat),
    req('Listar escenarios (paginado)', 'GET', '{{baseUrl}}/escenarios?page=0&size=10&nombre={{runId}}', null, 200, isPage),
    req('Obtener escenario', 'GET', '{{baseUrl}}/escenarios/{{escenarioId}}', null, 200),
    req('Obtener escenario inexistente → 404', 'GET', '{{baseUrl}}/escenarios/999999', null, 404, errorFormat),
    req('Listar espacios (subescenarios)', 'GET', '{{baseUrl}}/escenarios/{{escenarioId}}/subescenarios', null, 200,
      ["pm.test('Un espacio', function () { pm.expect(pm.response.json().length).to.eql(1); });"]),
    req('Actualizar escenario', 'PUT', '{{baseUrl}}/escenarios/{{escenarioId}}', { direccion: 'Carrera 9 # 8-7' }, 200),
    req('Ciclo (padre = su propio espacio) → 400', 'PUT', '{{baseUrl}}/escenarios/{{escenarioId}}',
      { escenarioPadreId: '{{subescenarioId}}' }, 400, errorFormat),
    req('Desactivar escenario con espacios activos → 409', 'PATCH', '{{baseUrl}}/escenarios/{{escenarioId}}/estado',
      { activo: false }, 409, errorFormat),
    req('Eliminar escenario con espacios → 409', 'DELETE', '{{baseUrl}}/escenarios/{{escenarioId}}', null, 409, errorFormat),
  ],
);

const torneos = folder(
  '07. Torneos (HU-GC-01)',
  'CRUD de torneos. Debe pertenecer a un deporte existente y activo; fechaFin ≥ fechaInicio; cierre de inscripciones ≤ fechaInicio. Estados: INSCRIPCIONES_ABIERTAS → EN_CURSO → FINALIZADO (o CANCELADO). Eliminar valida fases, partidos e inscripciones.',
  [
    req('Crear torneo', 'POST', '{{baseUrl}}/torneos',
      { nombre: 'Copa {{runId}}', fechaInicio: '{{fechaInicio}}', fechaFin: '{{fechaFin}}', fechaCierreInscripciones: '{{fechaCierre}}', deporteId: '{{deporteId}}' }, 201,
      [save('torneoId'), "pm.test('Estado inicial', function () { pm.expect(pm.response.json().estado).to.eql('INSCRIPCIONES_ABIERTAS'); });"]),
    req('Crear torneo con fechaFin < fechaInicio → 400', 'POST', '{{baseUrl}}/torneos',
      { nombre: 'Fechas mal {{runId}}', fechaInicio: '{{fechaFin}}', fechaFin: '{{fechaInicio}}', deporteId: '{{deporteId}}' }, 400, errorFormat),
    req('Crear torneo con cierre posterior al inicio → 400', 'POST', '{{baseUrl}}/torneos',
      { nombre: 'Cierre mal {{runId}}', fechaInicio: '{{fechaInicio}}', fechaFin: '{{fechaFin}}', fechaCierreInscripciones: '{{fechaFin}}', deporteId: '{{deporteId}}' }, 400, errorFormat),
    req('Crear torneo con deporte inexistente → 404', 'POST', '{{baseUrl}}/torneos',
      { nombre: 'Sin deporte {{runId}}', fechaInicio: '{{fechaInicio}}', fechaFin: '{{fechaFin}}', deporteId: 999999 }, 404, errorFormat),
    req('Crear torneo sin deporte → 400', 'POST', '{{baseUrl}}/torneos',
      { nombre: 'X', fechaInicio: '{{fechaInicio}}', fechaFin: '{{fechaFin}}' }, 400, errorFormat),
    req('Listar torneos (paginado, filtro por estado)', 'GET', '{{baseUrl}}/torneos?page=0&size=10&estado=INSCRIPCIONES_ABIERTAS&nombre={{runId}}', null, 200, isPage),
    req('Obtener torneo', 'GET', '{{baseUrl}}/torneos/{{torneoId}}', null, 200,
      ["pm.test('Incluye deporteNombre', function () { pm.expect(pm.response.json().deporteNombre).to.be.a('string'); });"]),
    req('Obtener torneo inexistente → 404', 'GET', '{{baseUrl}}/torneos/999999', null, 404, errorFormat),
    req('Actualizar torneo', 'PUT', '{{baseUrl}}/torneos/{{torneoId}}', { nombre: 'Copa {{runId}} (editada)' }, 200),
    req('Transición de estado inválida (→ FINALIZADO) → 409', 'PATCH', '{{baseUrl}}/torneos/{{torneoId}}/estado',
      { estado: 'FINALIZADO' }, 409, errorFormat),
    req('Estado inexistente → 400', 'PATCH', '{{baseUrl}}/torneos/{{torneoId}}/estado', { estado: 'PAUSADO' }, 400, errorFormat),
  ],
);

const inscripciones = folder(
  '08. Inscripciones (HU-GC-08a)',
  'Inscribir equipos a un torneo. El equipo debe estar asociado al deporte del torneo; sin duplicados; con el torneo iniciado o las inscripciones cerradas se bloquea inscribir y retirar.',
  [
    req('Inscribir equipo 1', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/inscripciones', { equipoId: '{{equipoId}}' }, 201,
      ["pm.test('Estado INSCRITO', function () { pm.expect(pm.response.json().estado).to.eql('INSCRITO'); });"]),
    req('Inscribir equipo 2', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/inscripciones', { equipoId: '{{equipo2Id}}' }, 201),
    req('Inscripción duplicada → 409', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/inscripciones', { equipoId: '{{equipoId}}' }, 409, errorFormat),
    req('Equipo no asociado al deporte del torneo → 400', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/inscripciones', { equipoId: '{{equipo3Id}}' }, 400, errorFormat),
    req('Equipo inexistente → 404', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/inscripciones', { equipoId: 999999 }, 404, errorFormat),
    req('Torneo inexistente → 404', 'POST', '{{baseUrl}}/torneos/999999/inscripciones', { equipoId: '{{equipoId}}' }, 404, errorFormat),
    req('Inscribir sin equipoId → 400', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/inscripciones', {}, 400, errorFormat),
    req('Listar inscripciones del torneo (paginado)', 'GET', '{{baseUrl}}/torneos/{{torneoId}}/inscripciones?page=0&size=10', null, 200,
      [...isPage, "pm.test('2 inscritos', function () { pm.expect(pm.response.json().totalElements).to.eql(2); });"]),
    req('Equipos habilitados del torneo (contrato para B)', 'GET', '{{baseUrl}}/torneos/{{torneoId}}/equipos', null, 200,
      ["pm.test('2 equipos habilitados', function () { pm.expect(pm.response.json().length).to.eql(2); });"]),
    req('Torneos de un equipo', 'GET', '{{baseUrl}}/equipos/{{equipoId}}/torneos', null, 200,
      ["pm.test('1 torneo', function () { pm.expect(pm.response.json().length).to.eql(1); });"]),
    req('Retirar equipo no inscrito → 404', 'DELETE', '{{baseUrl}}/torneos/{{torneoId}}/inscripciones/{{equipo3Id}}', null, 404, errorFormat),
    req('Cambiar deporte del torneo con inscritos → 409', 'PUT', '{{baseUrl}}/torneos/{{torneoId}}', { deporteId: '{{subdeporteId}}' }, 409, errorFormat),
    req('Eliminar torneo con inscripciones → 409', 'DELETE', '{{baseUrl}}/torneos/{{torneoId}}', null, 409, errorFormat),
  ],
);

const fases = folder(
  '09. Fases (HU-GC-03)',
  'Fases de un torneo con orden y tipo (GRUPO — se acepta GRUPOS como alias — o FINAL). El orden es único por torneo; eliminar se bloquea si tiene grupos, fase final o partidos.',
  [
    req('Crear fase de grupos (orden 1, alias GRUPOS)', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/fases',
      { nombre: 'Fase de grupos', tipo: 'GRUPOS', orden: 1 }, 201,
      [save('faseGruposId'), "pm.test('Tipo normalizado a GRUPO', function () { pm.expect(pm.response.json().tipo).to.eql('GRUPO'); });"]),
    req('Crear fase final (orden 2)', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/fases',
      { nombre: 'Fase final', tipo: 'FINAL', orden: 2 }, 201, [save('faseFinalId')]),
    req('Orden repetido → 409', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/fases',
      { nombre: 'Repetida', tipo: 'GRUPO', orden: 1 }, 409, errorFormat),
    req('Tipo inválido → 400', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/fases',
      { nombre: 'Rara', tipo: 'LIGUILLA', orden: 3 }, 400, errorFormat),
    req('Orden menor a 1 → 400', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/fases',
      { nombre: 'Cero', tipo: 'GRUPO', orden: 0 }, 400, errorFormat),
    req('Fase en torneo inexistente → 404', 'POST', '{{baseUrl}}/torneos/999999/fases',
      { nombre: 'X', tipo: 'GRUPO', orden: 1 }, 404, errorFormat),
    req('Listar fases del torneo (ordenadas)', 'GET', '{{baseUrl}}/torneos/{{torneoId}}/fases', null, 200,
      ["pm.test('Ordenadas por orden', function () { const l = pm.response.json(); pm.expect(l.length).to.eql(2); pm.expect(l[0].orden).to.be.below(l[1].orden); });"]),
    req('Obtener fase', 'GET', '{{baseUrl}}/fases/{{faseGruposId}}', null, 200),
    req('Obtener fase inexistente → 404', 'GET', '{{baseUrl}}/fases/999999', null, 404, errorFormat),
    req('Actualizar nombre de la fase', 'PUT', '{{baseUrl}}/fases/{{faseGruposId}}', { nombre: 'Primera fase' }, 200),
    req('Cambiar el orden a uno ya ocupado → 409', 'PUT', '{{baseUrl}}/fases/{{faseGruposId}}', { orden: 2 }, 409, errorFormat),
  ],
);

const grupos = folder(
  '10. Grupos (HU-GC-04)',
  'Grupos dentro de una fase de grupos. Un equipo debe estar inscrito en el torneo, no puede repetirse en un grupo ni estar en dos grupos de la misma fase. Borrar un grupo no borra los equipos.',
  [
    req('Crear grupo A', 'POST', '{{baseUrl}}/fases/{{faseGruposId}}/grupos', { nombreGrupo: 'Grupo A' }, 201, [save('grupoAId')]),
    req('Crear grupo B', 'POST', '{{baseUrl}}/fases/{{faseGruposId}}/grupos', { nombreGrupo: 'Grupo B' }, 201, [save('grupoBId')]),
    req('Nombre de grupo repetido en la fase → 409', 'POST', '{{baseUrl}}/fases/{{faseGruposId}}/grupos', { nombreGrupo: 'Grupo A' }, 409, errorFormat),
    req('Crear grupo en una fase FINAL → 400', 'POST', '{{baseUrl}}/fases/{{faseFinalId}}/grupos', { nombreGrupo: 'Grupo Z' }, 400, errorFormat),
    req('Crear grupo sin nombre → 400', 'POST', '{{baseUrl}}/fases/{{faseGruposId}}/grupos', {}, 400, errorFormat),
    req('Crear grupo en fase inexistente → 404', 'POST', '{{baseUrl}}/fases/999999/grupos', { nombreGrupo: 'X' }, 404, errorFormat),
    req('Agregar equipo 1 al grupo A', 'POST', '{{baseUrl}}/grupos/{{grupoAId}}/equipos', { equipoId: '{{equipoId}}' }, 201),
    req('Agregar equipo 2 al grupo B', 'POST', '{{baseUrl}}/grupos/{{grupoBId}}/equipos', { equipoId: '{{equipo2Id}}' }, 201),
    req('Equipo repetido en el mismo grupo → 409', 'POST', '{{baseUrl}}/grupos/{{grupoAId}}/equipos', { equipoId: '{{equipoId}}' }, 409, errorFormat),
    req('Equipo ya en otro grupo de la misma fase → 409', 'POST', '{{baseUrl}}/grupos/{{grupoBId}}/equipos', { equipoId: '{{equipoId}}' }, 409, errorFormat),
    req('Equipo no inscrito en el torneo → 400', 'POST', '{{baseUrl}}/grupos/{{grupoAId}}/equipos', { equipoId: '{{equipo3Id}}' }, 400, errorFormat),
    req('Equipo inexistente → 404', 'POST', '{{baseUrl}}/grupos/{{grupoAId}}/equipos', { equipoId: 999999 }, 404, errorFormat),
    req('Listar grupos de la fase', 'GET', '{{baseUrl}}/fases/{{faseGruposId}}/grupos', null, 200,
      ["pm.test('2 grupos con 1 equipo cada uno', function () { const l = pm.response.json(); pm.expect(l.length).to.eql(2); l.forEach(g => pm.expect(g.totalEquipos).to.eql(1)); });"]),
    req('Obtener grupo', 'GET', '{{baseUrl}}/grupos/{{grupoAId}}', null, 200),
    req('Obtener grupo inexistente → 404', 'GET', '{{baseUrl}}/grupos/999999', null, 404, errorFormat),
    req('Renombrar grupo', 'PUT', '{{baseUrl}}/grupos/{{grupoAId}}', { nombreGrupo: 'Grupo Alfa' }, 200,
      ["pm.test('Nombre actualizado', function () { pm.expect(pm.response.json().nombreGrupo).to.eql('Grupo Alfa'); });"]),
    req('Equipos del grupo', 'GET', '{{baseUrl}}/grupos/{{grupoAId}}/equipos', null, 200,
      ["pm.test('1 equipo', function () { pm.expect(pm.response.json().length).to.eql(1); });"]),
    req('Retirar equipo inscrito que está en un grupo → 409', 'DELETE', '{{baseUrl}}/torneos/{{torneoId}}/inscripciones/{{equipoId}}', null, 409, errorFormat,
      'No se puede retirar de la inscripción a un equipo que ya está en un grupo del torneo.'),
    req('Eliminar fase con grupos → 409', 'DELETE', '{{baseUrl}}/fases/{{faseGruposId}}', null, 409, errorFormat),
    req('Cambiar tipo de fase con grupos → 409', 'PUT', '{{baseUrl}}/fases/{{faseGruposId}}', { tipo: 'FINAL' }, 409, errorFormat),
    req('Quitar equipo del grupo (no borra el equipo)', 'DELETE', '{{baseUrl}}/grupos/{{grupoBId}}/equipos/{{equipo2Id}}', null, 200),
    req('Quitar equipo que no está en el grupo → 404', 'DELETE', '{{baseUrl}}/grupos/{{grupoBId}}/equipos/{{equipo2Id}}', null, 404, errorFormat),
    req('El equipo sigue existiendo', 'GET', '{{baseUrl}}/equipos/{{equipo2Id}}', null, 200),
  ],
);

const faseFinal = folder(
  '11. Fase final (HU-GC-05)',
  'Configuración de la fase final del torneo (llaves). Una por torneo, solo sobre una fase de tipo FINAL del mismo torneo; se modifica mientras no haya partidos en curso o finalizados.',
  [
    req('Crear fase final', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/fase-final',
      { faseId: '{{faseFinalId}}', modalidad: 'SEMIFINAL' }, 201,
      ["pm.test('Modalidad guardada', function () { pm.expect(pm.response.json().modalidad).to.eql('SEMIFINAL'); });"]),
    req('Segunda fase final en el mismo torneo → 409', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/fase-final',
      { faseId: '{{faseFinalId}}', modalidad: 'FINAL' }, 409, errorFormat),
    req('Apuntar a una fase de tipo GRUPO → 400', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/fase-final',
      { faseId: '{{faseGruposId}}', modalidad: 'FINAL' }, 400, errorFormat),
    req('Modalidad inválida → 400', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/fase-final',
      { faseId: '{{faseFinalId}}', modalidad: 'REPECHAJE' }, 400, errorFormat),
    req('Fase inexistente → 404', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/fase-final',
      { faseId: 999999, modalidad: 'FINAL' }, 404, errorFormat),
    req('Consultar fase final del torneo', 'GET', '{{baseUrl}}/torneos/{{torneoId}}/fase-final', null, 200),
    req('Actualizar modalidad', 'PUT', '{{baseUrl}}/torneos/{{torneoId}}/fase-final', { modalidad: 'FINAL' }, 200,
      ["pm.test('Modalidad actualizada', function () { pm.expect(pm.response.json().modalidad).to.eql('FINAL'); });"]),
    req('Eliminar fase (FINAL) con configuración → 409', 'DELETE', '{{baseUrl}}/fases/{{faseFinalId}}', null, 409, errorFormat),
  ],
);

const escenariosTorneos = folder(
  '12. Escenario–Torneo',
  'Escenarios asignados a un torneo. Sin duplicados; no se quita un escenario con partidos del torneo.',
  [
    req('Asignar escenario al torneo', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/escenarios/{{escenarioId}}', null, 201),
    req('Asignación repetida → 409', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/escenarios/{{escenarioId}}', null, 409, errorFormat),
    req('Escenario inexistente → 404', 'POST', '{{baseUrl}}/torneos/{{torneoId}}/escenarios/999999', null, 404, errorFormat),
    req('Torneo inexistente → 404', 'POST', '{{baseUrl}}/torneos/999999/escenarios/{{escenarioId}}', null, 404, errorFormat),
    req('Escenarios disponibles del torneo (contrato para B)', 'GET', '{{baseUrl}}/torneos/{{torneoId}}/escenarios', null, 200,
      ["pm.test('1 escenario', function () { pm.expect(pm.response.json().length).to.eql(1); });"]),
    req('Torneos de un escenario', 'GET', '{{baseUrl}}/escenarios/{{escenarioId}}/torneos', null, 200),
    req('Eliminar escenario asignado a un torneo → 409', 'DELETE', '{{baseUrl}}/escenarios/{{escenarioId}}', null, 409, errorFormat),
    req('Quitar escenario no asignado → 404', 'DELETE', '{{baseUrl}}/torneos/{{torneoId}}/escenarios/{{subescenarioId}}', null, 404, errorFormat),
  ],
);

const contrato = folder(
  '13. Contrato interno hacia B',
  'Endpoints agregados que consume el integrante B: estructura del torneo (fases ordenadas, grupos con equipos, fase final), equipos habilitados, jugadores vigentes y escenarios disponibles.',
  [
    req('Estructura completa del torneo', 'GET', '{{baseUrl}}/torneos/{{torneoId}}/estructura', null, 200,
      [
        "pm.test('Fases ordenadas con grupos y fase final', function () {",
        '  const j = pm.response.json();',
        '  pm.expect(j.fases.length).to.eql(2);',
        "  pm.expect(j.fases[0].tipo).to.eql('GRUPO');",
        '  pm.expect(j.fases[0].grupos.length).to.eql(2);',
        "  pm.expect(j.fases[1].tipo).to.eql('FINAL');",
        "  pm.expect(j.fases[1].modalidad).to.eql('FINAL');",
        '});',
      ]),
    req('Estructura de torneo inexistente → 404', 'GET', '{{baseUrl}}/torneos/999999/estructura', null, 404, errorFormat),
  ],
);

const estadosTorneo = folder(
  '14. Reglas con el torneo cerrado',
  'Usa un segundo torneo (torneo2) para no dejar residuos: con el torneo EN_CURSO se bloquea inscribir (409), no hay transiciones hacia atrás y, cancelado, ya no se modifica.',
  [
    req('Crear torneo 2', 'POST', '{{baseUrl}}/torneos',
      { nombre: 'Copa 2 {{runId}}', fechaInicio: '{{fechaInicio}}', fechaFin: '{{fechaFin}}', deporteId: '{{deporteId}}' }, 201, [save('torneo2Id')]),
    req('Pasar el torneo 2 a EN_CURSO', 'PATCH', '{{baseUrl}}/torneos/{{torneo2Id}}/estado', { estado: 'EN_CURSO' }, 200,
      ["pm.test('Torneo en curso', function () { pm.expect(pm.response.json().estado).to.eql('EN_CURSO'); });"]),
    req('Inscribir con el torneo en curso → 409', 'POST', '{{baseUrl}}/torneos/{{torneo2Id}}/inscripciones', { equipoId: '{{equipo2Id}}' }, 409, errorFormat),
    req('Volver atrás a INSCRIPCIONES_ABIERTAS no está permitido → 409', 'PATCH', '{{baseUrl}}/torneos/{{torneo2Id}}/estado',
      { estado: 'INSCRIPCIONES_ABIERTAS' }, 409, errorFormat),
    req('Crear fase en un torneo en curso (permitido; orden automático)', 'POST', '{{baseUrl}}/torneos/{{torneo2Id}}/fases',
      { nombre: 'Fase extra', tipo: 'GRUPO' }, 201,
      [save('faseExtraId'), "pm.test('Orden automático = 1', function () { pm.expect(pm.response.json().orden).to.eql(1); });"]),
    req('Eliminar la fase extra', 'DELETE', '{{baseUrl}}/fases/{{faseExtraId}}', null, 200),
    req('Cancelar el torneo 2', 'PATCH', '{{baseUrl}}/torneos/{{torneo2Id}}/estado', { estado: 'CANCELADO' }, 200),
    req('Modificar un torneo cancelado → 409', 'PUT', '{{baseUrl}}/torneos/{{torneo2Id}}', { nombre: 'No debería' }, 409, errorFormat),
    req('Crear fase en un torneo cancelado → 409', 'POST', '{{baseUrl}}/torneos/{{torneo2Id}}/fases',
      { nombre: 'Tarde', tipo: 'GRUPO', orden: 9 }, 409, errorFormat),
    req('Asignar escenario a un torneo cancelado → 409', 'POST', '{{baseUrl}}/torneos/{{torneo2Id}}/escenarios/{{escenarioId}}', null, 409, errorFormat),
  ],
);

const limpieza = folder(
  '15. Limpieza',
  'Elimina lo creado por la corrida respetando las dependencias. Los equipos y jugadores con historial no se pueden borrar (409): se desactivan.',
  [
    req('Quitar fase final del torneo', 'DELETE', '{{baseUrl}}/torneos/{{torneoId}}/fase-final', null, 200),
    req('Eliminar grupo A (con sus equipos)', 'DELETE', '{{baseUrl}}/grupos/{{grupoAId}}', null, 200),
    req('Eliminar grupo B', 'DELETE', '{{baseUrl}}/grupos/{{grupoBId}}', null, 200),
    req('Eliminar fase de grupos', 'DELETE', '{{baseUrl}}/fases/{{faseGruposId}}', null, 200),
    req('Eliminar fase final', 'DELETE', '{{baseUrl}}/fases/{{faseFinalId}}', null, 200),
    req('Quitar escenario del torneo', 'DELETE', '{{baseUrl}}/torneos/{{torneoId}}/escenarios/{{escenarioId}}', null, 200),
    req('Retirar equipo 1 del torneo', 'DELETE', '{{baseUrl}}/torneos/{{torneoId}}/inscripciones/{{equipoId}}', null, 200),
    req('Retirar equipo 2 del torneo', 'DELETE', '{{baseUrl}}/torneos/{{torneoId}}/inscripciones/{{equipo2Id}}', null, 200),
    req('Eliminar torneo', 'DELETE', '{{baseUrl}}/torneos/{{torneoId}}', null, 200),
    req('Eliminar torneo 2 (cancelado, sin asociaciones)', 'DELETE', '{{baseUrl}}/torneos/{{torneo2Id}}', null, 200),
    req('Eliminar espacio del escenario', 'DELETE', '{{baseUrl}}/escenarios/{{subescenarioId}}', null, 200),
    req('Eliminar escenario', 'DELETE', '{{baseUrl}}/escenarios/{{escenarioId}}', null, 200),
    req('Eliminar el subdeporte', 'DELETE', '{{baseUrl}}/deportes/{{subdeporteId}}', null, 200),
    req('Desasociar equipo 1 del deporte', 'DELETE', '{{baseUrl}}/equipos/{{equipoId}}/deportes/{{deporteId}}', null, 200),
    req('Desasociar equipo 2 del deporte', 'DELETE', '{{baseUrl}}/equipos/{{equipo2Id}}/deportes/{{deporteId}}', null, 200),
    req('Eliminar el deporte raíz', 'DELETE', '{{baseUrl}}/deportes/{{deporteId}}', null, 200),
    req('Eliminar equipo 3 (sin asociaciones)', 'DELETE', '{{baseUrl}}/equipos/{{equipo3Id}}', null, 200),
    req('Eliminar equipo femenino (sin asociaciones)', 'DELETE', '{{baseUrl}}/equipos/{{equipoFemId}}', null, 200),
    req('Desactivar equipo 1 (tiene historial de jugadores)', 'PATCH', '{{baseUrl}}/equipos/{{equipoId}}/estado', { activo: false }, 200,
      ["pm.test('Inactivo', function () { pm.expect(pm.response.json().activo).to.eql(false); });"]),
    req('Desactivar equipo 2 (tiene historial de jugadores)', 'PATCH', '{{baseUrl}}/equipos/{{equipo2Id}}/estado', { activo: false }, 200),
    req('Vincular un jugador a un equipo inactivo → 400', 'POST', '{{baseUrl}}/equipos/{{equipoId}}/jugadores', { jugadorId: '{{jugador2Id}}' }, 400, errorFormat),
    req('Eliminar jugador 2 (sin asociaciones)', 'DELETE', '{{baseUrl}}/jugadores/{{jugador2Id}}', null, 200),
    req('Desactivar jugador 1 (tiene historial)', 'PATCH', '{{baseUrl}}/jugadores/{{jugadorId}}/estado', { activo: false }, 200),
  ],
);

const seguridad = folder(
  '99. Seguridad (opcional)',
  'SOLO tiene sentido con DEV_SECURITY_BYPASS=false y ms_security activo: sin token válido el guard global responde 401/403. Con el bypass activado estas pruebas fallarán (es lo esperado).',
  [
    {
      name: 'Sin token → 401/403',
      event: [
        {
          listen: 'test',
          script: {
            type: 'text/javascript',
            exec: [
              "pm.test('Rechazado sin token (401 o 403)', function () { pm.expect([401, 403]).to.include(pm.response.code); });",
            ],
          },
        },
      ],
      request: {
        method: 'GET',
        header: [],
        auth: { type: 'noauth' },
        url: url('{{baseUrl}}/deportes'),
        description: 'Petición sin cabecera Authorization.',
      },
    },
  ],
);

// ---------- colección ----------

const collection = {
  info: {
    name: 'Sports Management API - Participante A (núcleo deportivo + estructura del torneo)',
    description: [
      'Colección del integrante A. Cubre: Deporte, Equipo, Equipo–Deporte, Jugador, Equipo–Jugador, Escenario, Torneo, Inscripción, Fase, Grupo, Fase final y Escenario–Torneo.',
      '',
      'CÓMO USARLA',
      '1. Levantar ms_negocio (npm run start:dev) con la BD creada con Untitled.sql + docs/database/extension-participante-a.sql.',
      '2. Para pruebas locales usar DEV_SECURITY_BYPASS=true (o poner un JWT válido en la variable token).',
      '3. Ejecutar la colección COMPLETA, en orden, con el Collection Runner: cada carpeta deja los ids que necesita la siguiente en variables de colección.',
      '4. Cada ejecución genera un {{runId}} nuevo, así que se puede repetir sin choques de nombres.',
      '',
      'CONVENCIONES: prefijo /api/v1, JSON camelCase, listados paginados ?page=&size= (page base 0) → { content, totalElements, page, size }, errores { timestamp, status, error, message, path }; 400 validación, 404 no existe, 409 duplicado/asociaciones.',
    ].join('\n'),
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  auth: {
    type: 'bearer',
    bearer: [{ key: 'token', value: '{{token}}', type: 'string' }],
  },
  variable: [
    { key: 'baseUrl', value: 'http://localhost:3000/api/v1', type: 'string' },
    { key: 'token', value: 'dev-token-valido', type: 'string' },
  ],
  item: [
    prep,
    deportes,
    equipos,
    equiposDeportes,
    jugadores,
    equiposJugadores,
    escenarios,
    torneos,
    inscripciones,
    fases,
    grupos,
    faseFinal,
    escenariosTorneos,
    contrato,
    estadosTorneo,
    limpieza,
    seguridad,
  ],
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(collection, null, 2), 'utf8');

const total = collection.item.reduce((n, f) => n + f.item.length, 0);
console.log(`Colección generada: ${OUT}`);
console.log(`${collection.item.length} carpetas, ${total} requests`);
