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

const PARTIDO_ID = Number(args.partido || process.env.PARTIDO_ID || 1);
const INTERVALO_MS = Number(args.intervalo || process.env.INTERVALO_MS || 1000);
const DURACION_SEC = Number(args.duracion || process.env.DURACION_SEC || 30);
const API_HOST = args.host || process.env.API_HOST || 'localhost';
const API_PORT = Number(args.port || process.env.API_PORT || 3000);
const TOKEN = args.token || process.env.TOKEN || 'DEV_BYPASS_TOKEN';

console.log('='.repeat(60));
console.log(' SIMULADOR DE POSICIONES EN VIVO (HU-GC-09)');
console.log(` Partido ID : ${PARTIDO_ID}`);
console.log(` Intervalo  : ${INTERVALO_MS} ms`);
console.log(` Duración   : ${DURACION_SEC > 0 ? DURACION_SEC + ' s' : 'Indefinida'}`);
console.log(` Endpoint   : http://${API_HOST}:${API_PORT}/api/v1/partidos/${PARTIDO_ID}/posiciones`);
console.log('='.repeat(60));

// Elementos a simular: 10 jugadores (5 por equipo) + 1 pelota
const elementos = [
  { id: 1, esPelota: false, x: 20, y: 30, vx: 1.5, vy: 1.0 },
  { id: 2, esPelota: false, x: 25, y: 60, vx: -1.2, vy: 1.5 },
  { id: 3, esPelota: false, x: 40, y: 45, vx: 2.0, vy: -1.8 },
  { id: 4, esPelota: false, x: 45, y: 75, vx: -1.0, vy: -1.2 },
  { id: 5, esPelota: false, x: 10, y: 50, vx: 0.5, vy: 0.8 },
  { id: 6, esPelota: false, x: 80, y: 30, vx: -1.5, vy: -1.0 },
  { id: 7, esPelota: false, x: 75, y: 60, vx: 1.2, vy: -1.5 },
  { id: 8, esPelota: false, x: 60, y: 45, vx: -2.0, vy: 1.8 },
  { id: 9, esPelota: false, x: 55, y: 75, vx: 1.0, vy: 1.2 },
  { id: 10, esPelota: false, x: 90, y: 50, vx: -0.5, vy: -0.8 },
  { id: null, esPelota: true, x: 50, y: 50, vx: 3.5, vy: 2.5 },
];

function actualizarPosiciones() {
  const timestamp = new Date().toISOString();
  return elementos.map((el) => {
    // Actualizar con rebotes en los límites del campo (0 a 100)
    el.x += el.vx + (Math.random() - 0.5) * 1.5;
    el.y += el.vy + (Math.random() - 0.5) * 1.5;

    if (el.x <= 2 || el.x >= 98) {
      el.vx *= -1;
      el.x = Math.max(2, Math.min(98, el.x));
    }
    if (el.y <= 2 || el.y >= 98) {
      el.vy *= -1;
      el.y = Math.max(2, Math.min(98, el.y));
    }

    return {
      jugadorId: el.esPelota ? undefined : el.id,
      esPelota: el.esPelota,
      x: Number(el.x.toFixed(2)),
      y: Number(el.y.toFixed(2)),
      timestamp,
    };
  });
}

function enviarLote(posiciones) {
  const payload = JSON.stringify({ posiciones });
  const req = http.request(
    {
      hostname: API_HOST,
      port: API_PORT,
      path: `/api/v1/partidos/${PARTIDO_ID}/posiciones`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        Authorization: `Bearer ${TOKEN}`,
      },
    },
    (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          process.stdout.write(
            `\r[${new Date().toLocaleTimeString()}] Lote enviado: ${posiciones.length} posiciones (HTTP ${res.statusCode})`,
          );
        } else {
          console.error(`\nError enviando lote: HTTP ${res.statusCode} - ${body}`);
        }
      });
    },
  );

  req.on('error', (err) => {
    console.error(`\nError de conexión con el backend: ${err.message}`);
  });

  req.write(payload);
  req.end();
}

const startTime = Date.now();
const timer = setInterval(() => {
  const elapsed = (Date.now() - startTime) / 1000;
  if (DURACION_SEC > 0 && elapsed >= DURACION_SEC) {
    clearInterval(timer);
    console.log(`\nSimulación completada tras ${DURACION_SEC} segundos.`);
    process.exit(0);
  }
  const posiciones = actualizarPosiciones();
  enviarLote(posiciones);
}, INTERVALO_MS);

process.on('SIGINT', () => {
  clearInterval(timer);
  console.log('\nSimulación detenida por el usuario.');
  process.exit(0);
});
