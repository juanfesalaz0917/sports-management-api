-- =========================================================
-- EXTENSION DEL ESQUEMA - INTEGRANTE A
-- Nucleo deportivo + estructura del torneo
--
-- Se ejecuta UNA sola vez, DESPUES de Untitled.sql (y despues de
-- cargar, si se desea, seed-db.js: no es necesario, los cambios son
-- compatibles con sus INSERT).
-- Todos los cambios son aditivos: no se tocan tablas de B ni de C.
-- MySQL 8 / InnoDB. synchronize=false, el esquema se gestiona aqui.
-- =========================================================

-- Seleccione antes la base de datos del proyecto (USE <su_bd>;), p. ej. torneos_deportivos
-- o ms_negocio_deportes, la misma que usa DB_NAME en el .env / app.module.ts.

-- ---------------------------------------------------------
-- 1. DEPORTE: jerarquia (subdeportes) + desactivacion logica
-- ---------------------------------------------------------
ALTER TABLE deporte
    ADD COLUMN id_deporte_padre BIGINT NULL AFTER descripcion,
    ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1 AFTER id_deporte_padre,
    ADD CONSTRAINT fk_deporte_padre
        FOREIGN KEY (id_deporte_padre) REFERENCES deporte(id_deporte)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    -- En MySQL un UNIQUE con NULL no bloquea duplicados de nivel raiz:
    -- el servicio tambien valida "nombre unico dentro del mismo padre".
    ADD CONSTRAINT uq_deporte_nombre_padre UNIQUE (nombre, id_deporte_padre);

-- ---------------------------------------------------------
-- 2. EQUIPO: activo + genero (el enunciado distingue masculino/femenino)
-- ---------------------------------------------------------
ALTER TABLE equipo
    ADD COLUMN genero ENUM('MASCULINO', 'FEMENINO', 'MIXTO') NULL AFTER nombre,
    ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1 AFTER fecha_creacion;

-- ---------------------------------------------------------
-- 3. JUGADOR: documento unico + activo
-- (UNIQUE permite varios NULL: los jugadores ya sembrados siguen validos)
-- ---------------------------------------------------------
ALTER TABLE jugador
    ADD COLUMN documento VARCHAR(30) NULL AFTER apellido,
    ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1 AFTER id_posicion,
    ADD CONSTRAINT uq_jugador_documento UNIQUE (documento);

-- ---------------------------------------------------------
-- 4. EQUIPO_JUGADOR: historial de traspasos
-- PK surrogate; vinculo vigente = fecha_fin IS NULL.
-- Se conserva fecha_vinculacion como fecha de inicio (seed-db.js la usa).
-- Un jugador puede volver a un equipo en otro periodo; que no existan
-- dos vinculos vigentes iguales lo valida el servicio.
-- ---------------------------------------------------------
ALTER TABLE equipo_jugador
    DROP FOREIGN KEY fk_ej_equipo,
    DROP PRIMARY KEY,
    ADD COLUMN id_equipo_jugador BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST,
    ADD COLUMN fecha_fin DATE NULL AFTER fecha_vinculacion,
    ADD CONSTRAINT chk_ej_fechas
        CHECK (fecha_fin IS NULL OR fecha_vinculacion IS NULL OR fecha_fin >= fecha_vinculacion),
    ADD INDEX idx_ej_equipo (id_equipo),
    ADD INDEX idx_ej_vigente (id_jugador, id_equipo, fecha_fin);

ALTER TABLE equipo_jugador
    ADD CONSTRAINT fk_ej_equipo
        FOREIGN KEY (id_equipo) REFERENCES equipo(id_equipo)
        ON DELETE CASCADE;

-- ---------------------------------------------------------
-- 5. TORNEO: estado, cierre de inscripciones, activo
-- ---------------------------------------------------------
ALTER TABLE torneo
    ADD COLUMN estado ENUM('INSCRIPCIONES_ABIERTAS', 'EN_CURSO', 'FINALIZADO', 'CANCELADO')
        NOT NULL DEFAULT 'INSCRIPCIONES_ABIERTAS' AFTER fecha_fin,
    ADD COLUMN fecha_cierre_inscripciones DATE NULL AFTER estado,
    ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1 AFTER id_deporte,
    ADD CONSTRAINT chk_cierre_inscripciones
        CHECK (fecha_cierre_inscripciones IS NULL
               OR fecha_inicio IS NULL
               OR fecha_cierre_inscripciones <= fecha_inicio);

-- ---------------------------------------------------------
-- 6. FASE: orden de ejecucion
-- Sin UNIQUE(id_torneo, orden): los INSERT de B (StubsService.seedDemoData,
-- seed-db.js) no informan orden y el DEFAULT 1 chocaria. El servicio
-- valida orden unico por torneo.
-- ---------------------------------------------------------
ALTER TABLE fase
    ADD COLUMN orden INT NOT NULL DEFAULT 1 AFTER tipo,
    ADD CONSTRAINT chk_fase_orden CHECK (orden >= 1);

-- Ordena las fases ya existentes por id dentro de cada torneo.
UPDATE fase f
JOIN (
    SELECT id_fase,
           ROW_NUMBER() OVER (PARTITION BY id_torneo ORDER BY id_fase) AS rn
    FROM fase
) o ON o.id_fase = f.id_fase
SET f.orden = o.rn;

-- ---------------------------------------------------------
-- 7. GRUPO: id propio (varios grupos por fase) + grupo_equipo
-- Antes: PK = FK id_fase (un unico grupo por fase).
-- id_fase se conserva con el mismo nombre (seed-db.js inserta
-- (id_fase, nombre_grupo)).
-- ---------------------------------------------------------
ALTER TABLE grupo
    DROP FOREIGN KEY fk_grupo_fase,
    DROP PRIMARY KEY,
    ADD COLUMN id_grupo BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST,
    ADD INDEX idx_grupo_fase (id_fase),
    -- Necesario para la FK compuesta de grupo_equipo.
    ADD CONSTRAINT uq_grupo_id_fase UNIQUE (id_grupo, id_fase);

ALTER TABLE grupo
    ADD CONSTRAINT fk_grupo_fase
        FOREIGN KEY (id_fase) REFERENCES fase(id_fase)
        ON DELETE CASCADE
        ON UPDATE CASCADE;

-- Un equipo solo puede estar en un grupo por fase.
-- id_fase esta denormalizado a proposito: UNIQUE(id_fase, id_equipo)
-- lo garantiza en BD, y la FK compuesta evita que id_fase no coincida
-- con la fase real del grupo.
CREATE TABLE grupo_equipo (
    id_grupo BIGINT NOT NULL,
    id_fase BIGINT NOT NULL,
    id_equipo BIGINT NOT NULL,

    PRIMARY KEY (id_grupo, id_equipo),

    CONSTRAINT uq_grupo_equipo_fase_equipo
        UNIQUE (id_fase, id_equipo),

    CONSTRAINT fk_ge_grupo
        FOREIGN KEY (id_grupo, id_fase)
        REFERENCES grupo(id_grupo, id_fase)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_ge_equipo
        FOREIGN KEY (id_equipo)
        REFERENCES equipo(id_equipo)
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- 8. ESCENARIO: jerarquia (complejo -> espacios) + activo
-- ---------------------------------------------------------
ALTER TABLE escenario
    ADD COLUMN id_escenario_padre BIGINT NULL AFTER direccion,
    ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1 AFTER id_escenario_padre,
    ADD CONSTRAINT fk_escenario_padre
        FOREIGN KEY (id_escenario_padre) REFERENCES escenario(id_escenario)
        ON DELETE SET NULL
        ON UPDATE CASCADE;
