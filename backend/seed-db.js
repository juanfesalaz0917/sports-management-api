const mysql = require('mysql2/promise');

async function seed() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'mostro',
    password: '210910624Dj',
    database: 'torneos_deportivos',
    multipleStatements: true,
  });

  console.log('Conectado a MySQL torneos_deportivos para inyección de datos de prueba...');

  // 1. Catálogos base (Deportes, Habilidades, Posiciones, Escenarios, Pelotas, Metodos de Pago)
  await conn.query(`
    INSERT IGNORE INTO deporte (id_deporte, nombre, descripcion) VALUES
    (1, 'Fútbol 11', 'Fútbol tradicional en campo de césped'),
    (2, 'Fútbol Sala', 'Fútbol rápido en cancha cubierta'),
    (3, 'Baloncesto', 'Baloncesto profesional 5 vs 5');

    INSERT IGNORE INTO habilidad (id_habilidad, nombre, descripcion) VALUES
    (1, 'Tiro con Chanfle', 'Especialista en remates curvados de media y larga distancia'),
    (2, 'Visión de Juego', 'Precisión en pases filtrados y cambios de frente'),
    (3, 'Regate Corto', 'Capacidad de eludir defensores en espacios reducidos'),
    (4, 'Velocidad Explosiva', 'Gran aceleración en contragolpes'),
    (5, 'Atajadas Reflejas', 'Tiempo de reacción inmediato bajo los tres palos');

    INSERT IGNORE INTO posicion_espacial (id_posicion, nombre, descripcion) VALUES
    (1, 'Portero', 'Guardameta responsable del arco'),
    (2, 'Defensa Central', 'Zaguero líder de la línea defensiva'),
    (3, 'Centrocampista', 'Volante creador de juego y distribución'),
    (4, 'Delantero Centro', 'Atacante goleador de área');

    INSERT IGNORE INTO escenario (id_escenario, nombre, direccion) VALUES
    (1, 'Estadio Metropolitano Mostro', 'Av. Deportiva 123, Sector Norte'),
    (2, 'Coliseo El Campín', 'Calle 57 con Cra 30');

    INSERT IGNORE INTO pelota (id_pelota, referencia, marca) VALUES
    (1, 'Al Rihla Pro 2026', 'Adidas'),
    (2, 'Flight FIFA Pro', 'Nike'),
    (3, 'Molten BG5000', 'Molten');

    INSERT IGNORE INTO metodo_pago (id_metodo_pago, nombre, descripcion) VALUES
    (1, 'Tarjeta de Crédito Visa/Mastercard', 'Pasarela bancaria con tarjeta de crédito'),
    (2, 'Cuenta de Ahorros Bancolombia', 'Transferencia directa o débito en cuenta'),
    (3, 'Billetera Digital Nequi', 'Pago móvil digital inmediato'),
    (4, 'PSE Débito Seguro', 'Pago de servicios electrónicos bancarios');
  `);

  // 2. Equipos y Jugadores
  await conn.query(`
    INSERT IGNORE INTO equipo (id_equipo, nombre, fecha_creacion) VALUES
    (1, 'Real Mostro FC', '2020-01-15'),
    (2, 'Atlético Metropolitano', '2019-05-20'),
    (3, 'Titanes del Valle', '2021-08-10'),
    (4, 'Halcones del Norte', '2022-03-01');

    INSERT IGNORE INTO equipo_deporte (id_equipo, id_deporte) VALUES
    (1, 1), (2, 1), (3, 1), (4, 1);

    INSERT IGNORE INTO jugador (id_jugador, nombre, apellido, fecha_nacimiento, id_posicion) VALUES
    (1, 'Carlos', 'Valderrama', '1995-09-02', 3),
    (2, 'Radamel', 'Falcao', '1996-02-10', 4),
    (3, 'David', 'Ospina', '1994-08-31', 1),
    (4, 'Mario', 'Yepes', '1993-01-13', 2),
    (5, 'James', 'Rodríguez', '1997-07-12', 3),
    (6, 'Luis', 'Díaz', '1998-01-13', 4),
    (7, 'Juan', 'Cuadrado', '1995-05-26', 3),
    (8, 'Yerry', 'Mina', '1996-09-23', 2);

    INSERT IGNORE INTO equipo_jugador (id_equipo, id_jugador, fecha_vinculacion) VALUES
    (1, 1, '2023-01-01'),
    (1, 2, '2023-01-01'),
    (1, 3, '2023-01-01'),
    (1, 4, '2023-01-01'),
    (2, 5, '2023-01-01'),
    (2, 6, '2023-01-01'),
    (2, 7, '2023-01-01'),
    (2, 8, '2023-01-01');

    INSERT IGNORE INTO habilidad_jugador (id_jugador, id_habilidad) VALUES
    (1, 2), (1, 3),
    (2, 1), (2, 4),
    (3, 5),
    (5, 1), (5, 2),
    (6, 3), (6, 4);
  `);

  // 3. Torneo, Fases, Escenario Torneo e Inscripciones
  await conn.query(`
    INSERT IGNORE INTO torneo (id_torneo, nombre, fecha_inicio, fecha_fin, id_deporte) VALUES
    (1, 'Copa BetPlay Mostro 2026', '2026-03-01', '2026-06-30', 1),
    (2, 'Liga Clausura Élite', '2026-07-01', '2026-11-30', 1);

    INSERT IGNORE INTO fase (id_fase, nombre, tipo, id_torneo) VALUES
    (1, 'Fase de Grupos - Grupo A', 'GRUPO', 1),
    (2, 'Fase Final - Gran Final', 'FINAL', 1);

    INSERT IGNORE INTO grupo (id_fase, nombre_grupo) VALUES
    (1, 'Grupo A');

    INSERT IGNORE INTO fase_final (id_fase, modalidad) VALUES
    (2, 'Partido Único');

    INSERT IGNORE INTO escenario_torneo (id_escenario, id_torneo) VALUES
    (1, 1), (2, 1);

    INSERT IGNORE INTO inscripcion (id_inscripcion, id_torneo, id_equipo, fecha_inscripcion, estado) VALUES
    (1, 1, 1, '2026-02-15', 'CONFIRMADA'),
    (2, 1, 2, '2026-02-16', 'CONFIRMADA'),
    (3, 1, 3, '2026-02-17', 'CONFIRMADA'),
    (4, 1, 4, '2026-02-18', 'CONFIRMADA');
  `);

  // 4. Localidades
  await conn.query(`
    INSERT IGNORE INTO localidad (id_localidad, nombre, capacidad, id_escenario) VALUES
    (1, 'Occidental VIP', 500, 1),
    (2, 'Oriental Preferencial', 2000, 1),
    (3, 'Norte Popular', 3500, 1),
    (4, 'Sur Popular', 3500, 1),
    (5, 'Platea Principal', 1200, 2);
  `);

  // 5. Aficionados, Métodos de Pago y Favoritos
  await conn.query(`
    INSERT IGNORE INTO aficionado (id_aficionado, usuario_id, nombre, apellido, telefono, fecha_registro) VALUES
    (1, 1, 'Juan Carlos', 'Pérez Salazar', '3001234567', NOW()),
    (2, 2, 'María Fernanda', 'Gómez Ríos', '3109876543', NOW()),
    (3, 3, 'Andrés Felipe', 'Torres Mora', '3155554433', NOW());

    INSERT IGNORE INTO aficionado_equipo (id_aficionado, id_equipo) VALUES
    (1, 1), (1, 3),
    (2, 2),
    (3, 4);

    INSERT IGNORE INTO metodo_pago_aficionado (id_metodo_aficionado, id_aficionado, id_metodo_pago, referencia) VALUES
    (1, 1, 1, 'Visa **** 4242 (Vence 12/28)'),
    (2, 1, 3, 'Nequi 3001234567'),
    (3, 2, 2, 'Ahorros Bancolombia **** 8901');
  `);

  // 6. Partidos, Anotaciones, Boletos y Apuestas
  await conn.query(`
    -- Partido 1: EN CURSO (Real Mostro vs Atlético Metropolitano)
    INSERT IGNORE INTO partido (id_partido, fecha_hora, estado, id_torneo, id_fase, id_escenario, id_pelota) VALUES
    (1, NOW(), 'EN_CURSO', 1, 1, 1, 1),
    -- Partido 2: PROGRAMADO (Titanes vs Halcones)
    (2, DATE_ADD(NOW(), INTERVAL 3 DAY), 'PROGRAMADO', 1, 1, 1, 2),
    -- Partido 3: FINALIZADO (Real Mostro vs Titanes, 2-1)
    (3, DATE_SUB(NOW(), INTERVAL 2 DAY), 'FINALIZADO', 1, 1, 2, 1);

    INSERT IGNORE INTO partido_equipo (id_partido, rol, id_equipo) VALUES
    (1, 'LOCAL', 1), (1, 'VISITANTE', 2),
    (2, 'LOCAL', 3), (2, 'VISITANTE', 4),
    (3, 'LOCAL', 1), (3, 'VISITANTE', 3);

    -- Anotaciones en Partido 1
    INSERT IGNORE INTO anotacion (id_anotacion, minuto, descripcion, id_partido, id_jugador) VALUES
    (1, 23, 'Gol de jugada colectiva - remate al ángulo', 1, 2),
    (2, 67, 'Gol de tiro libre directo', 1, 5);

    -- Anotaciones en Partido 3 (Finalizado 2-1)
    INSERT IGNORE INTO anotacion (id_anotacion, minuto, descripcion, id_partido, id_jugador) VALUES
    (3, 14, 'Cabezazo tras tiro de esquina', 3, 2),
    (4, 55, 'Descuento de penal', 3, 1),
    (5, 88, 'Gol de contragolpe fulminante', 3, 2);

    -- Boletos emitidos
    INSERT IGNORE INTO boleto (id_boleto, codigo, precio, estado, id_partido, id_localidad, id_aficionado) VALUES
    (1, 'BOL-METRO-001', 45.00, 'PAGADO', 1, 1, 1),
    (2, 'BOL-METRO-002', 30.00, 'PAGADO', 1, 2, 2),
    (3, 'BOL-METRO-003', 20.00, 'DISPONIBLE', 2, 3, NULL),
    (4, 'BOL-CAMPIN-001', 35.00, 'PAGADO', 3, 5, 1);

    -- Apuestas
    INSERT IGNORE INTO apuesta (id_apuesta, monto, fecha_hora, estado, id_aficionado, id_partido, id_metodo_aficionado) VALUES
    (1, 50.00, NOW(), 'PENDIENTE', 1, 1, 1),
    (2, 100.00, NOW(), 'PENDIENTE', 2, 1, 3),
    (3, 80.00, DATE_SUB(NOW(), INTERVAL 2 DAY), 'GANADA', 1, 3, 1),
    (4, 40.00, DATE_SUB(NOW(), INTERVAL 2 DAY), 'PERDIDA', 3, 3, NULL);
  `);

  console.log('¡Inyección de datos de prueba completada exitosamente!');
  await conn.end();
}

seed().catch(err => {
  console.error('Error inyectando datos:', err);
  process.exit(1);
});
