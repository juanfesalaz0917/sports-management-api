/**
 * Simulador de posiciones espaciales para partidos en vivo (HU-GC-09)
 * Genera coordenadas en tiempo real para jugadores y pelota y las envía en lote al backend.
 *
 * Uso:
 *   node scripts/simulador-posiciones.js --partido=1 --intervalo=1000 --duracion=30
 */
const http = require('http');

const args = process.argv.slice(2).reduce((acc, arg) => {
  const [k, v] = arg.replace(/^--/, '').split('=');
  acc[k] = v;
  return acc;
}, {});

const PARTIDO_ID = Number(args.partido || process.env.PARTIDO_ID);
const INTERVALO_MS = Number(args.intervalo || process.env.INTERVALO_MS || 1000);
const DURACION_SEC = Number(args.duracion || process.env.DURACION_SEC || 30);
const API_HOST = args.host || process.env.API_HOST || 'localhost';
const API_PORT = Number(args.port || process.env.API_PORT || 3000);
const TOKEN = args.token || process.env.TOKEN;

if (!PARTIDO_ID) throw new Error('Indica --partido=<id>');
if (!TOKEN) throw new Error('Indica --token="$TOKEN" o la variable de entorno TOKEN');

function requestJson(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: API_HOST, port: API_PORT, path, method: 'GET', headers: { Authorization: `Bearer ${TOKEN}` } }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          return;
        }
        try { resolve(JSON.parse(body)); } catch (error) { reject(error); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function enviarLote(posiciones) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ posiciones });
    const req = http.request({ hostname: API_HOST, port: API_PORT, path: `/api/v1/partidos/${PARTIDO_ID}/posiciones`, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), Authorization: `Bearer ${TOKEN}` } }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve();
        else {
          const mensajes = { 400: 'Datos inválidos', 401: 'Token ausente o inválido', 403: 'Sin permiso', 404: 'Partido no encontrado', 409: 'Conflicto de partido o posición' };
          reject(new Error(`${mensajes[res.statusCode] || 'Error'} (HTTP ${res.statusCode}): ${body}`));
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

(async () => {
  const partido = await requestJson(`/api/v1/partidos/${PARTIDO_ID}`);
  if (['FINALIZADO', 'CANCELADO'].includes(partido.estado)) throw new Error(`El partido ${PARTIDO_ID} ya está ${partido.estado}`);

  const equipos = partido.partidoEquipos || partido.equipos || [];
  const jugadores = [];
  for (const equipo of equipos) {
    const equipoId = equipo.id_equipo ?? equipo.equipoId ?? equipo.equipo?.id;
    if (!equipoId) continue;
    const vinculados = await requestJson(`/api/v1/equipos/${equipoId}/jugadores?vigentes=true`);
    const lista = Array.isArray(vinculados) ? vinculados : vinculados.content || [];
    for (const vinculo of lista) {
      const jugador = vinculo.jugador || vinculo;
      const id = Number(jugador.id ?? jugador.id_jugador ?? vinculo.jugadorId);
      if (id) jugadores.push({ id, esPelota: false, x: 0.1 + Math.random() * 0.8, y: 0.1 + Math.random() * 0.8, vx: (Math.random() - 0.5) * 0.03, vy: (Math.random() - 0.5) * 0.03 });
    }
  }
  if (!jugadores.length) throw new Error('El partido no tiene jugadores vigentes en sus equipos');

  jugadores.push({ id: null, esPelota: true, x: 0.5, y: 0.5, vx: 0.02, vy: 0.015 });
  const inicio = Date.now();
  let detenido = false;

  const intervalo = setInterval(async () => {
    if (detenido) return;
    if (DURACION_SEC > 0 && (Date.now() - inicio) / 1000 >= DURACION_SEC) {
      detenido = true;
      clearInterval(intervalo);
      console.log(`\nSimulación completada tras ${DURACION_SEC} segundos.`);
      return;
    }
    for (const el of jugadores) {
      el.x = Math.max(0.02, Math.min(0.98, el.x + el.vx + (Math.random() - 0.5) * 0.006));
      el.y = Math.max(0.02, Math.min(0.98, el.y + el.vy + (Math.random() - 0.5) * 0.006));
      if (el.x <= 0.02 || el.x >= 0.98) el.vx *= -1;
      if (el.y <= 0.02 || el.y >= 0.98) el.vy *= -1;
    }
    const timestamp = new Date().toISOString();
    const posiciones = jugadores.map((el) => ({ ...(el.esPelota ? { esPelota: true } : { jugadorId: el.id, esPelota: false }), x: Number(el.x.toFixed(4)), y: Number(el.y.toFixed(4)), timestamp }));
    try { await enviarLote(posiciones); process.stdout.write(`\rLote enviado: ${posiciones.length} posiciones normalizadas`); }
    catch (error) { detenido = true; clearInterval(intervalo); console.error(`\n${error.message}`); }
  }, INTERVALO_MS);

  process.on('SIGINT', () => { detenido = true; clearInterval(intervalo); console.log('\nSimulación detenida por el usuario.'); });
})().catch((error) => { console.error(error.message); process.exit(1); });
