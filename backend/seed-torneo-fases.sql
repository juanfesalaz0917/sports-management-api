-- =========================================================
-- TORNEO DE PRUEBA CON FASES - torneos_deportivos (Sports MS)
-- Requiere haber ejecutado antes seed-datos-prueba.sql
-- (deporte 2 'Fútbol 11', equipos 1-4, escenarios 2-3).
-- Crea: 1 torneo, 2 fases (GRUPO + FINAL), 2 grupos con equipos,
--       la fase_final (modalidad SEMIFINAL), inscripciones y escenarios.
-- Uso: mysql -u mostro -p torneos_deportivos < seed-torneo-fases.sql
-- =========================================================
USE torneos_deportivos;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------- TORNEO ----------
INSERT INTO torneo (id_torneo, nombre, fecha_inicio, fecha_fin, estado, fecha_cierre_inscripciones, id_deporte, activo) VALUES
(1, 'Copa Mostro 2026', '2026-12-01', '2026-12-30', 'INSCRIPCIONES_ABIERTAS', '2026-11-30', 2, 1);

-- ---------- FASES (orden unico por torneo) ----------
INSERT INTO fase (id_fase, nombre, tipo, orden, id_torneo) VALUES
(1, 'Fase de grupos', 'GRUPO', 1, 1),
(2, 'Fase final',     'FINAL', 2, 1);

-- ---------- GRUPOS (hijos de la fase 1) ----------
INSERT INTO grupo (id_grupo, id_fase, nombre_grupo) VALUES
(1, 1, 'Grupo A'),
(2, 1, 'Grupo B');

-- ---------- FASE FINAL (hija de la fase 2) ----------
-- Quitar este INSERT si quieres probar el POST /torneos/1/fase-final desde la UI
INSERT INTO fase_final (id_fase, modalidad) VALUES
(2, 'SEMIFINAL');

-- ---------- INSCRIPCIONES ----------
INSERT INTO inscripcion (id_inscripcion, id_torneo, id_equipo, fecha_inscripcion, estado) VALUES
(1, 1, 1, '2026-11-20', 'ACTIVA'),
(2, 1, 2, '2026-11-20', 'ACTIVA'),
(3, 1, 3, '2026-11-21', 'ACTIVA'),
(4, 1, 4, '2026-11-21', 'ACTIVA');

-- ---------- EQUIPOS POR GRUPO (id_fase denormalizado) ----------
INSERT INTO grupo_equipo (id_grupo, id_equipo, id_fase) VALUES
(1, 1, 1), (1, 2, 1),
(2, 3, 1), (2, 4, 1);

-- ---------- ESCENARIOS DEL TORNEO ----------
INSERT INTO escenario_torneo (id_escenario, id_torneo) VALUES
(2, 1), (3, 1);

SET FOREIGN_KEY_CHECKS = 1;
