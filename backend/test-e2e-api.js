const axios = require('axios');
const { spawn } = require('child_process');

async function waitServer(url, maxRetries = 25) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await axios.get(url, { timeout: 1000 });
      return true;
    } catch (e) {
      if (e.response) return true;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  return false;
}

async function run() {
  console.log('--- INICIANDO SERVIDOR CON TORNEOS_DEPORTIVOS ---');
  const server = spawn('node', ['dist/main.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    env: { ...process.env, PORT: '3000', DEV_SECURITY_BYPASS: 'true' },
  });

  const isUp = await waitServer('http://localhost:3000/api/v1/stubs/health');
  if (!isUp) {
    console.error('El servidor no respondió a tiempo');
    server.kill();
    process.exit(1);
  }

  const base = 'http://localhost:3000/api/v1';
  const headers = { 'x-bypass-security': 'true' };

  try {
    console.log('\n1. Sembrando datos iniciales en torneos_deportivos (Stubs)...');
    const seedRes = await axios.post(`${base}/stubs/seed`, {}, { headers });
    console.log('✅ Seed OK:', seedRes.data.mensaje);

    console.log('\n2. Creando Pelota (Entidad 15 🔴)...');
    const pelotaRes = await axios.post(`${base}/pelotas`, {
      marca: 'Adidas',
      referencia: 'Al Rihla 2026'
    }, { headers });
    console.log('✅ Pelota creada ID:', pelotaRes.data.id);

    console.log('\n3. Creando Posición Espacial (Entidad 16 🔴)...');
    const posRes = await axios.post(`${base}/posiciones-espaciales`, {
      nombre: 'Delantero Centro',
      descripcion: 'Atacante principal en punta'
    }, { headers });
    console.log('✅ Posición Espacial creada ID:', posRes.data.id, 'Nombre:', posRes.data.nombre);

    console.log('\n4. Creando Localidad para Escenario...');
    const locRes = await axios.post(`${base}/localidades`, {
      nombre: 'Tribuna Occidental',
      capacidad: 500,
      escenarioId: seedRes.data.escenario.id
    }, { headers });
    console.log('✅ Localidad creada ID:', locRes.data.id);

    console.log('\n5. Creando Partido con Equipos Local y Visitante (Entidad 13 🟢)...');
    const partidoRes = await axios.post(`${base}/partidos`, {
      fechaHora: new Date(Date.now() + 86400000).toISOString(),
      torneoId: seedRes.data.torneo.id,
      faseId: seedRes.data.fase.id,
      escenarioId: seedRes.data.escenario.id,
      equipoLocalId: seedRes.data.equipo1.id,
      equipoVisitanteId: seedRes.data.equipo2.id,
      pelotaId: pelotaRes.data.id,
      estado: 'PROGRAMADO'
    }, { headers });
    const partidoId = partidoRes.data.id;
    console.log('✅ Partido creado ID:', partidoId);

    console.log('\n6. Registrando Anotación (Entidad 14 🟢)...');
    const anotacionRes = await axios.post(`${base}/partidos/${partidoId}/anotaciones`, {
      jugadorId: seedRes.data.j1.id,
      minuto: 34,
      descripcion: 'Gol de cabeza tras centro'
    }, { headers });
    console.log('✅ Anotación registrada ID:', anotacionRes.data.id);

    console.log('\n7. Asignando Habilidad a Jugador (Entidad 17 🟢)...');
    const habRes = await axios.post(`${base}/jugadores/${seedRes.data.j1.id}/habilidades/${seedRes.data.habilidad.id}`, {}, { headers });
    console.log('✅ Habilidad asignada a Jugador:', habRes.data.jugadorNombre, '->', habRes.data.habilidadNombre);

    console.log('\n8. Registrando Aficionado vinculado a Seguridad (Entidad 20 🟢)...');
    const usuarioId = Math.floor(Math.random() * 90000) + 1000;
    const aficionadoRes = await axios.post(`${base}/aficionados`, {
      usuarioId,
      nombre: 'Andrés',
      apellido: 'Gómez',
      telefono: '3159998877'
    }, { headers });
    const aficionadoId = aficionadoRes.data.id;
    console.log('✅ Aficionado creado ID:', aficionadoId, 'usuarioId:', usuarioId);

    console.log('\n9. Asociando Equipo Favorito al Aficionado (Entidad 21 🟢)...');
    await axios.post(`${base}/aficionados/${aficionadoId}/equipos/${seedRes.data.equipo1.id}`, {}, { headers });
    console.log('✅ Equipo favorito asignado con éxito');

    console.log('\n10. Registrando Método de Pago del Aficionado (Entidad 22 🟢)...');
    const mpRes = await axios.post(`${base}/aficionados/${aficionadoId}/metodos-pago`, {
      metodoPagoId: seedRes.data.metodoPago.id,
      referencia: 'Tarjeta Visa Gold terminada en 4567'
    }, { headers });
    console.log('✅ Método de pago aficionado ID:', mpRes.data.id);

    console.log('\n11. Emitiendo Boleto para Partido (Entidad 19 🟢)...');
    const boletoRes = await axios.post(`${base}/boletos`, {
      codigo: `BOL-${Date.now()}`,
      precio: 65.50,
      partidoId,
      localidadId: locRes.data.id,
      aficionadoId,
      estado: 'VALIDO'
    }, { headers });
    console.log('✅ Boleto emitido ID:', boletoRes.data.id, 'Código:', boletoRes.data.codigo);

    console.log('\n12. Realizando Apuesta Deportiva (Entidad 23 🟢)...');
    const apuestaRes = await axios.post(`${base}/apuestas`, {
      monto: 150.00,
      aficionadoId,
      partidoId,
      metodoAficionadoId: mpRes.data.id,
      estado: 'REGISTRADA'
    }, { headers });
    console.log('✅ Apuesta registrada ID:', apuestaRes.data.id, 'Monto: $', apuestaRes.data.monto);

    console.log('\n13. Consultando Desarrollo del Torneo (HU-GC-08b)...');
    const desRes = await axios.get(`${base}/torneos/${seedRes.data.torneo.id}/desarrollo`, { headers });
    console.log('✅ Desarrollo del torneo consultado:', desRes.data.nombre);
    console.log('   Fases encontradas:', desRes.data.fases.length);

    console.log('\n========================================================================');
    console.log('🎉 TODAS LAS ENTIDADES Y CASOS DE NEGOCIO FUNCIONAN CON TORNEOS_DEPORTIVOS 🎉');
    console.log('========================================================================');
  } catch (err) {
    console.error('❌ Error en prueba:', err.response?.data || err.message);
  } finally {
    server.kill();
    process.exit(0);
  }
}

run();
