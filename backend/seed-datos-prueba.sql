-- =========================================================
-- DATOS DE PRUEBA - torneos_deportivos (Sports MS)
-- Cubre todas las entidades EXCEPTO torneo/partido y las que
-- dependen obligatoriamente de ellos (fase, grupo, fase_final,
-- escenario_torneo, inscripcion, partido_equipo, anotacion,
-- boleto, apuesta).
-- Columnas tomadas de las entidades TypeORM (activo, *_padre,
-- genero, documento, fecha_fin). Ejecutar sobre BD vacia.
-- Uso: mysql -u mostro -p torneos_deportivos < seed-datos-prueba.sql
-- =========================================================
USE torneos_deportivos;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------- DEPORTE (con jerarquia padre/hijo) ----------
INSERT INTO deporte (id_deporte, nombre, descripcion, id_deporte_padre, activo) VALUES
(1, 'Fútbol',        'Deporte de conjunto con balón, 11 vs 11',            NULL, 1),
(2, 'Fútbol 11',     'Fútbol tradicional en campo de césped',               1,    1),
(3, 'Fútbol Sala',   'Fútbol en cancha cubierta, 5 vs 5',                   1,    1),
(4, 'Baloncesto',    'Baloncesto 5 vs 5',                                   NULL, 1),
(5, 'Voleibol',      'Voleibol de sala 6 vs 6',                             NULL, 1),
(6, 'Tenis de Mesa', 'Deporte de raqueta (descontinuado en la liga)',       NULL, 0);

-- ---------- POSICION ESPACIAL ----------
INSERT INTO posicion_espacial (id_posicion, nombre, descripcion) VALUES
(1, 'Portero',          'Guardameta responsable del arco'),
(2, 'Defensa Central',  'Zaguero líder de la línea defensiva'),
(3, 'Lateral',          'Defensa por banda con proyección ofensiva'),
(4, 'Mediocampista',    'Volante creador de juego y distribución'),
(5, 'Extremo',          'Atacante por banda'),
(6, 'Delantero Centro', 'Atacante goleador de área'),
(7, 'Base',             'Armador de juego en baloncesto'),
(8, 'Pívot',            'Jugador interior en baloncesto');

-- ---------- HABILIDAD ----------
INSERT INTO habilidad (id_habilidad, nombre, descripcion) VALUES
(1, 'Tiro con Chanfle',     'Remates curvados de media y larga distancia'),
(2, 'Visión de Juego',      'Precisión en pases filtrados y cambios de frente'),
(3, 'Regate Corto',         'Eludir defensores en espacios reducidos'),
(4, 'Velocidad Explosiva',  'Gran aceleración en contragolpes'),
(5, 'Atajadas Reflejas',    'Reacción inmediata bajo los tres palos'),
(6, 'Juego Aéreo',          'Dominio del cabezazo en balón parado'),
(7, 'Marca Personal',       'Anticipación y marca al hombre'),
(8, 'Tiro Libre',           'Especialista en balón parado directo');

-- ---------- ESCENARIO (con jerarquia padre/hijo) ----------
INSERT INTO escenario (id_escenario, nombre, direccion, id_escenario_padre, activo) VALUES
(1, 'Complejo Deportivo Palogrande', 'Cra 23 # 65-00, Manizales',          NULL, 1),
(2, 'Estadio Palogrande',            'Cra 23 # 65-00, Manizales',          1,    1),
(3, 'Coliseo Menor Palogrande',      'Cra 23 # 65-00, Manizales',          1,    1),
(4, 'Estadio Metropolitano Mostro',  'Av. Deportiva 123, Sector Norte',    NULL, 1),
(5, 'Coliseo El Campín',             'Calle 57 con Cra 30, Bogotá',        NULL, 1),
(6, 'Cancha Sintética La Enea',      'Km 5 Vía al Magdalena, Manizales',   NULL, 0);

-- ---------- LOCALIDAD ----------
INSERT INTO localidad (id_localidad, nombre, capacidad, id_escenario) VALUES
(1,  'Occidental VIP',          500,  2),
(2,  'Oriental Preferencial',   2000, 2),
(3,  'Norte Popular',           3500, 2),
(4,  'Sur Popular',             3500, 2),
(5,  'Platea Coliseo Menor',    800,  3),
(6,  'Tribuna General Menor',   1500, 3),
(7,  'Occidental Metropolitano', 1200, 4),
(8,  'Oriental Metropolitano',   2500, 4),
(9,  'Platea Principal',        1200, 5),
(10, 'Gradería Alta',           2000, 5);

-- ---------- PELOTA ----------
INSERT INTO pelota (id_pelota, referencia, marca) VALUES
(1, 'Al Rihla Pro 2026', 'Adidas'),
(2, 'Flight FIFA Pro',   'Nike'),
(3, 'BG5000',            'Molten'),
(4, 'Mikasa V200W',      'Mikasa'),
(5, 'Strike Sala 62',    'Golty');

-- ---------- METODO DE PAGO ----------
INSERT INTO metodo_pago (id_metodo_pago, nombre, descripcion) VALUES
(1, 'Tarjeta de Crédito',  'Visa / Mastercard mediante pasarela bancaria'),
(2, 'Tarjeta Débito',      'Débito directo a cuenta'),
(3, 'Nequi',               'Billetera digital móvil'),
(4, 'PSE',                 'Pago de servicios electrónicos bancarios'),
(5, 'Daviplata',           'Billetera digital Davivienda');

-- ---------- EQUIPO ----------
INSERT INTO equipo (id_equipo, nombre, genero, fecha_creacion, activo) VALUES
(1, 'Real Mostro FC',          'MASCULINO', '2020-01-15', 1),
(2, 'Atlético Metropolitano',  'MASCULINO', '2019-05-20', 1),
(3, 'Titanes del Valle',       'MASCULINO', '2021-08-10', 1),
(4, 'Halcones del Norte',      'MASCULINO', '2022-03-01', 1),
(5, 'Amazonas FC',             'FEMENINO',  '2021-02-14', 1),
(6, 'Tigresas Ucaldas',        'FEMENINO',  '2023-06-30', 1),
(7, 'Deportivo Mixto Caldas',  'MIXTO',     '2022-09-09', 1),
(8, 'Club Veteranos 80',       'MASCULINO', '2015-11-01', 0);

-- ---------- EQUIPO_DEPORTE ----------
INSERT INTO equipo_deporte (id_equipo, id_deporte) VALUES
(1, 2), (2, 2), (3, 2), (4, 2),
(5, 2), (6, 2), (6, 3),
(7, 3), (7, 5),
(8, 2);

-- ---------- JUGADOR ----------
INSERT INTO jugador (id_jugador, nombre, apellido, documento, fecha_nacimiento, id_posicion, activo) VALUES
(1,  'Carlos',   'Valderrama', '1001001001', '1995-09-02', 4, 1),
(2,  'Radamel',  'Falcao',     '1001001002', '1996-02-10', 6, 1),
(3,  'David',    'Ospina',     '1001001003', '1994-08-31', 1, 1),
(4,  'Mario',    'Yepes',      '1001001004', '1993-01-13', 2, 1),
(5,  'James',    'Rodríguez',  '1001001005', '1997-07-12', 4, 1),
(6,  'Luis',     'Díaz',       '1001001006', '1998-01-13', 5, 1),
(7,  'Juan',     'Cuadrado',   '1001001007', '1995-05-26', 3, 1),
(8,  'Yerry',    'Mina',       '1001001008', '1996-09-23', 2, 1),
(9,  'Camilo',   'Vargas',     '1001001009', '1992-03-09', 1, 1),
(10, 'Jhon',     'Córdoba',    '1001001010', '1999-05-11', 6, 1),
(11, 'Daniel',   'Muñoz',      '1001001011', '1996-05-26', 3, 1),
(12, 'Jefferson','Lerma',      '1001001012', '1994-10-25', 4, 1),
(13, 'Linda',    'Caicedo',    '1001001013', '2005-02-23', 6, 1),
(14, 'Catalina', 'Usme',       '1001001014', '1989-12-25', 6, 1),
(15, 'Natalia',  'Giraldo',    '1001001015', '1998-04-17', 4, 1),
(16, 'Manuela',  'Vanegas',    '1001001016', '2000-08-02', 1, 1),
(17, 'Sofía',    'Ramírez',    '1001001017', '2001-11-30', 2, 1),
(18, 'Andrés',   'Ocampo',     '1001001018', '1999-07-07', 8, 1),
(19, 'Felipe',   'Marín',      '1001001019', '1997-01-19', 7, 1),
(20, 'Pedro',    'Retirado',   '1001001020', '1980-06-06', 2, 0);

-- ---------- EQUIPO_JUGADOR (historial: fecha_fin NULL = vigente) ----------
INSERT INTO equipo_jugador (id_equipo, id_jugador, fecha_vinculacion, fecha_fin) VALUES
(1, 1,  '2023-01-01', NULL),
(1, 2,  '2023-01-01', NULL),
(1, 3,  '2023-01-01', NULL),
(1, 4,  '2023-01-01', NULL),
(1, 9,  '2024-02-01', NULL),
(2, 5,  '2023-01-01', NULL),
(2, 6,  '2023-01-01', NULL),
(2, 7,  '2023-01-01', NULL),
(2, 8,  '2023-01-01', NULL),
(3, 10, '2024-01-15', NULL),
(3, 11, '2024-01-15', NULL),
(3, 12, '2024-01-15', NULL),
(4, 7,  '2021-01-01', '2022-12-31'),   -- traspaso: antes en Halcones
(4, 12, '2022-01-01', '2023-12-31'),   -- traspaso: luego fue a Titanes
(5, 13, '2023-03-01', NULL),
(5, 14, '2023-03-01', NULL),
(6, 15, '2024-03-01', NULL),
(6, 16, '2024-03-01', NULL),
(6, 17, '2024-03-01', NULL),
(7, 18, '2024-05-01', NULL),
(7, 19, '2024-05-01', NULL),
(8, 20, '2015-11-01', '2020-12-31');

-- ---------- HABILIDAD_JUGADOR ----------
INSERT INTO habilidad_jugador (id_jugador, id_habilidad) VALUES
(1, 2), (1, 3), (1, 8),
(2, 1), (2, 4), (2, 6),
(3, 5),
(4, 6), (4, 7),
(5, 1), (5, 2), (5, 8),
(6, 3), (6, 4),
(8, 6), (8, 7),
(9, 5),
(10, 4), (10, 6),
(13, 3), (13, 4),
(14, 1),
(15, 2),
(16, 5),
(17, 7);

-- ---------- AFICIONADO (usuario_id = id en Security MS) ----------
INSERT INTO aficionado (id_aficionado, usuario_id, nombre, apellido, telefono, fecha_registro) VALUES
(1, 101, 'Juan Carlos',    'Pérez Salazar', '3001234567', '2026-01-10 09:00:00'),
(2, 102, 'María Fernanda', 'Gómez Ríos',    '3109876543', '2026-01-12 14:30:00'),
(3, 103, 'Andrés Felipe',  'Torres Mora',   '3155554433', '2026-01-15 18:45:00'),
(4, 104, 'Laura Sofía',    'Henao Duque',   '3201112233', '2026-02-01 10:15:00'),
(5, 105, 'Santiago',       'Quintero',      '3124445566', '2026-02-05 20:00:00'),
(6, 106, 'Valentina',      'Arango Cruz',   NULL,         '2026-02-20 08:20:00');

-- ---------- AFICIONADO_EQUIPO (equipos favoritos) ----------
INSERT INTO aficionado_equipo (id_aficionado, id_equipo) VALUES
(1, 1), (1, 3),
(2, 2),
(3, 4),
(4, 5), (4, 6),
(5, 1), (5, 2),
(6, 7);

-- ---------- METODO_PAGO_AFICIONADO ----------
INSERT INTO metodo_pago_aficionado (id_metodo_aficionado, id_aficionado, id_metodo_pago, referencia) VALUES
(1, 1, 1, 'Visa **** 4242 (vence 12/28)'),
(2, 1, 3, 'Nequi 3001234567'),
(3, 2, 2, 'Débito Bancolombia **** 8901'),
(4, 3, 4, 'PSE Banco de Bogotá'),
(5, 4, 3, 'Nequi 3201112233'),
(6, 4, 1, 'Mastercard **** 5555 (vence 03/27)'),
(7, 5, 5, 'Daviplata 3124445566');
-- aficionado 6 queda sin metodo de pago (caso de prueba: no puede apostar)

SET FOREIGN_KEY_CHECKS = 1;
