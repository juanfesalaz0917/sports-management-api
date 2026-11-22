-- =========================================================
-- PROYECTO: SISTEMA DE GESTION DE TORNEOS DEPORTIVOS
-- BASE DE DATOS: torneos_deportivos
-- MOTOR: MySQL 8 / InnoDB
-- MICROSERVICIO: Sports MS
-- =========================================================


-- =========================================================
-- 1. CREACION DE LA BASE DE DATOS
-- =========================================================

CREATE DATABASE IF NOT EXISTS torneos_deportivos
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE torneos_deportivos;


-- =========================================================
-- 2. ENTIDADES PRINCIPALES
-- =========================================================

CREATE TABLE deporte (
    id_deporte BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
) ENGINE=InnoDB;


CREATE TABLE equipo (
    id_equipo BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_creacion DATE
) ENGINE=InnoDB;


CREATE TABLE habilidad (
    id_habilidad BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
) ENGINE=InnoDB;


CREATE TABLE posicion_espacial (
    id_posicion BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
) ENGINE=InnoDB;


CREATE TABLE escenario (
    id_escenario BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(255)
) ENGINE=InnoDB;


CREATE TABLE pelota (
    id_pelota BIGINT AUTO_INCREMENT PRIMARY KEY,
    referencia VARCHAR(100),
    marca VARCHAR(100)
) ENGINE=InnoDB;


-- =========================================================
-- 3. AFICIONADOS
-- INTEGRACION CON EL MICROSERVICIO DE SEGURIDAD
-- =========================================================

CREATE TABLE aficionado (
    id_aficionado BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Identificador del usuario en Security MS.
    -- No es una FK porque pertenece a otra base de datos.
    usuario_id BIGINT NOT NULL UNIQUE,

    nombre VARCHAR(100),
    apellido VARCHAR(100),
    telefono VARCHAR(20),

    fecha_registro DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_aficionado_usuario
        UNIQUE (usuario_id)
) ENGINE=InnoDB;


-- =========================================================
-- 4. METODOS DE PAGO
-- =========================================================

CREATE TABLE metodo_pago (
    id_metodo_pago BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
) ENGINE=InnoDB;


-- =========================================================
-- 5. TORNEOS
-- =========================================================

CREATE TABLE torneo (
    id_torneo BIGINT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(150) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,

    id_deporte BIGINT NOT NULL,

    CONSTRAINT fk_torneo_deporte
        FOREIGN KEY (id_deporte)
        REFERENCES deporte(id_deporte)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_fechas_torneo
        CHECK (
            fecha_fin IS NULL
            OR fecha_inicio IS NULL
            OR fecha_fin >= fecha_inicio
        )
) ENGINE=InnoDB;


-- =========================================================
-- 6. FASES DEL TORNEO
-- Fase es abstracta en el diagrama de clases.
-- Se implementa mediante una tabla padre y tablas hijas.
-- =========================================================

CREATE TABLE fase (
    id_fase BIGINT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100),

    tipo ENUM('GRUPO', 'FINAL') NOT NULL,

    id_torneo BIGINT NOT NULL,

    CONSTRAINT fk_fase_torneo
        FOREIGN KEY (id_torneo)
        REFERENCES torneo(id_torneo)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- Especializacion: Grupo

CREATE TABLE grupo (
    id_fase BIGINT PRIMARY KEY,

    nombre_grupo VARCHAR(50),

    CONSTRAINT fk_grupo_fase
        FOREIGN KEY (id_fase)
        REFERENCES fase(id_fase)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- Especializacion: Final

CREATE TABLE fase_final (
    id_fase BIGINT PRIMARY KEY,

    modalidad VARCHAR(100),

    CONSTRAINT fk_final_fase
        FOREIGN KEY (id_fase)
        REFERENCES fase(id_fase)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =========================================================
-- 7. RELACIONES ENTRE ESCENARIOS Y TORNEOS
-- =========================================================

CREATE TABLE escenario_torneo (
    id_escenario BIGINT NOT NULL,
    id_torneo BIGINT NOT NULL,

    PRIMARY KEY (id_escenario, id_torneo),

    CONSTRAINT fk_et_escenario
        FOREIGN KEY (id_escenario)
        REFERENCES escenario(id_escenario)
        ON DELETE CASCADE,

    CONSTRAINT fk_et_torneo
        FOREIGN KEY (id_torneo)
        REFERENCES torneo(id_torneo)
        ON DELETE CASCADE
) ENGINE=InnoDB;


-- =========================================================
-- 8. INSCRIPCIONES
-- Relacion entre equipos y torneos
-- =========================================================

CREATE TABLE inscripcion (
    id_inscripcion BIGINT AUTO_INCREMENT PRIMARY KEY,

    id_torneo BIGINT NOT NULL,
    id_equipo BIGINT NOT NULL,

    fecha_inscripcion DATE,
    estado VARCHAR(30),

    CONSTRAINT uq_inscripcion_torneo_equipo
        UNIQUE (id_torneo, id_equipo),

    CONSTRAINT fk_inscripcion_torneo
        FOREIGN KEY (id_torneo)
        REFERENCES torneo(id_torneo)
        ON DELETE RESTRICT,

    CONSTRAINT fk_inscripcion_equipo
        FOREIGN KEY (id_equipo)
        REFERENCES equipo(id_equipo)
        ON DELETE RESTRICT
) ENGINE=InnoDB;


-- =========================================================
-- 9. RELACION EQUIPO - DEPORTE
-- Relacion N:M
-- =========================================================

CREATE TABLE equipo_deporte (
    id_equipo BIGINT NOT NULL,
    id_deporte BIGINT NOT NULL,

    PRIMARY KEY (id_equipo, id_deporte),

    CONSTRAINT fk_ed_equipo
        FOREIGN KEY (id_equipo)
        REFERENCES equipo(id_equipo)
        ON DELETE CASCADE,

    CONSTRAINT fk_ed_deporte
        FOREIGN KEY (id_deporte)
        REFERENCES deporte(id_deporte)
        ON DELETE CASCADE
) ENGINE=InnoDB;


-- =========================================================
-- 10. JUGADORES
-- =========================================================

CREATE TABLE jugador (
    id_jugador BIGINT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    fecha_nacimiento DATE,

    id_posicion BIGINT,

    CONSTRAINT fk_jugador_posicion
        FOREIGN KEY (id_posicion)
        REFERENCES posicion_espacial(id_posicion)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =========================================================
-- 11. RELACION EQUIPO - JUGADOR
-- Relacion N:M
-- =========================================================

CREATE TABLE equipo_jugador (
    id_equipo BIGINT NOT NULL,
    id_jugador BIGINT NOT NULL,

    fecha_vinculacion DATE,

    PRIMARY KEY (id_equipo, id_jugador),

    CONSTRAINT fk_ej_equipo
        FOREIGN KEY (id_equipo)
        REFERENCES equipo(id_equipo)
        ON DELETE CASCADE,

    CONSTRAINT fk_ej_jugador
        FOREIGN KEY (id_jugador)
        REFERENCES jugador(id_jugador)
        ON DELETE CASCADE
) ENGINE=InnoDB;


-- =========================================================
-- 12. RELACION JUGADOR - HABILIDAD
-- Relacion N:M
-- =========================================================

CREATE TABLE habilidad_jugador (
    id_jugador BIGINT NOT NULL,
    id_habilidad BIGINT NOT NULL,

    PRIMARY KEY (id_jugador, id_habilidad),

    CONSTRAINT fk_hj_jugador
        FOREIGN KEY (id_jugador)
        REFERENCES jugador(id_jugador)
        ON DELETE CASCADE,

    CONSTRAINT fk_hj_habilidad
        FOREIGN KEY (id_habilidad)
        REFERENCES habilidad(id_habilidad)
        ON DELETE CASCADE
) ENGINE=InnoDB;


-- =========================================================
-- 13. PARTIDOS
-- =========================================================

CREATE TABLE partido (
    id_partido BIGINT AUTO_INCREMENT PRIMARY KEY,

    fecha_hora DATETIME NOT NULL,
    estado VARCHAR(30),

    id_torneo BIGINT NOT NULL,
    id_fase BIGINT,
    id_escenario BIGINT NOT NULL,
    id_pelota BIGINT,

    CONSTRAINT fk_partido_torneo
        FOREIGN KEY (id_torneo)
        REFERENCES torneo(id_torneo)
        ON DELETE RESTRICT,

    CONSTRAINT fk_partido_fase
        FOREIGN KEY (id_fase)
        REFERENCES fase(id_fase)
        ON DELETE SET NULL,

    CONSTRAINT fk_partido_escenario
        FOREIGN KEY (id_escenario)
        REFERENCES escenario(id_escenario)
        ON DELETE RESTRICT,

    CONSTRAINT fk_partido_pelota
        FOREIGN KEY (id_pelota)
        REFERENCES pelota(id_pelota)
        ON DELETE SET NULL
) ENGINE=InnoDB;


-- =========================================================
-- 14. RELACION PARTIDO - EQUIPO
-- Permite identificar equipo local y visitante.
-- =========================================================

CREATE TABLE partido_equipo (
    id_partido BIGINT NOT NULL,
    id_equipo BIGINT NOT NULL,

    rol ENUM('LOCAL', 'VISITANTE') NOT NULL,

    PRIMARY KEY (id_partido, rol),

    CONSTRAINT uq_partido_equipo
        UNIQUE (id_partido, id_equipo),

    CONSTRAINT fk_pe_partido
        FOREIGN KEY (id_partido)
        REFERENCES partido(id_partido)
        ON DELETE CASCADE,

    CONSTRAINT fk_pe_equipo
        FOREIGN KEY (id_equipo)
        REFERENCES equipo(id_equipo)
        ON DELETE RESTRICT
) ENGINE=InnoDB;


-- =========================================================
-- 15. ANOTACIONES
-- =========================================================

CREATE TABLE anotacion (
    id_anotacion BIGINT AUTO_INCREMENT PRIMARY KEY,

    minuto INT NOT NULL,
    descripcion TEXT,

    id_partido BIGINT NOT NULL,
    id_jugador BIGINT NOT NULL,

    CONSTRAINT fk_anotacion_partido
        FOREIGN KEY (id_partido)
        REFERENCES partido(id_partido)
        ON DELETE CASCADE,

    CONSTRAINT fk_anotacion_jugador
        FOREIGN KEY (id_jugador)
        REFERENCES jugador(id_jugador)
        ON DELETE RESTRICT,

    CONSTRAINT chk_anotacion_minuto
        CHECK (minuto >= 0)
) ENGINE=InnoDB;


-- =========================================================
-- 16. LOCALIDADES
-- =========================================================

CREATE TABLE localidad (
    id_localidad BIGINT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,
    capacidad INT,

    id_escenario BIGINT NOT NULL,

    CONSTRAINT fk_localidad_escenario
        FOREIGN KEY (id_escenario)
        REFERENCES escenario(id_escenario)
        ON DELETE CASCADE,

    CONSTRAINT chk_localidad_capacidad
        CHECK (capacidad IS NULL OR capacidad >= 0)
) ENGINE=InnoDB;


-- =========================================================
-- 17. BOLETOS
-- =========================================================

CREATE TABLE boleto (
    id_boleto BIGINT AUTO_INCREMENT PRIMARY KEY,

    codigo VARCHAR(100) NOT NULL UNIQUE,
    precio DECIMAL(12,2) NOT NULL,
    estado VARCHAR(30),

    id_partido BIGINT NOT NULL,
    id_localidad BIGINT NOT NULL,
    id_aficionado BIGINT,

    CONSTRAINT fk_boleto_partido
        FOREIGN KEY (id_partido)
        REFERENCES partido(id_partido)
        ON DELETE RESTRICT,

    CONSTRAINT fk_boleto_localidad
        FOREIGN KEY (id_localidad)
        REFERENCES localidad(id_localidad)
        ON DELETE RESTRICT,

    CONSTRAINT fk_boleto_aficionado
        FOREIGN KEY (id_aficionado)
        REFERENCES aficionado(id_aficionado)
        ON DELETE SET NULL,

    CONSTRAINT chk_boleto_precio
        CHECK (precio >= 0)
) ENGINE=InnoDB;


-- =========================================================
-- 18. RELACION AFICIONADO - EQUIPO
-- Relacion N:M
-- =========================================================

CREATE TABLE aficionado_equipo (
    id_aficionado BIGINT NOT NULL,
    id_equipo BIGINT NOT NULL,

    PRIMARY KEY (id_aficionado, id_equipo),

    CONSTRAINT fk_ae_aficionado
        FOREIGN KEY (id_aficionado)
        REFERENCES aficionado(id_aficionado)
        ON DELETE CASCADE,

    CONSTRAINT fk_ae_equipo
        FOREIGN KEY (id_equipo)
        REFERENCES equipo(id_equipo)
        ON DELETE CASCADE
) ENGINE=InnoDB;


-- =========================================================
-- 19. METODOS DE PAGO ASOCIADOS A AFICIONADOS
-- =========================================================

CREATE TABLE metodo_pago_aficionado (
    id_metodo_aficionado BIGINT AUTO_INCREMENT PRIMARY KEY,

    id_aficionado BIGINT NOT NULL,
    id_metodo_pago BIGINT NOT NULL,

    referencia VARCHAR(150),

    CONSTRAINT uq_metodo_aficionado
        UNIQUE (id_metodo_aficionado, id_aficionado),

    CONSTRAINT fk_mpa_aficionado
        FOREIGN KEY (id_aficionado)
        REFERENCES aficionado(id_aficionado)
        ON DELETE CASCADE,

    CONSTRAINT fk_mpa_metodo
        FOREIGN KEY (id_metodo_pago)
        REFERENCES metodo_pago(id_metodo_pago)
        ON DELETE RESTRICT
) ENGINE=InnoDB;


-- =========================================================
-- 20. APUESTAS
-- =========================================================

CREATE TABLE apuesta (
    id_apuesta BIGINT AUTO_INCREMENT PRIMARY KEY,

    monto DECIMAL(12,2) NOT NULL,

    fecha_hora DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    estado VARCHAR(30),

    id_aficionado BIGINT NOT NULL,
    id_partido BIGINT NOT NULL,
    id_metodo_aficionado BIGINT NOT NULL,

    CONSTRAINT fk_apuesta_aficionado
        FOREIGN KEY (id_aficionado)
        REFERENCES aficionado(id_aficionado)
        ON DELETE RESTRICT,

    CONSTRAINT fk_apuesta_partido
        FOREIGN KEY (id_partido)
        REFERENCES partido(id_partido)
        ON DELETE RESTRICT,

    -- Garantiza que el metodo de pago utilizado
    -- pertenezca al mismo aficionado que realiza la apuesta.
    CONSTRAINT fk_apuesta_metodo_aficionado
        FOREIGN KEY (id_metodo_aficionado, id_aficionado)
        REFERENCES metodo_pago_aficionado(
            id_metodo_aficionado,
            id_aficionado
        )
        ON DELETE RESTRICT,

    CONSTRAINT chk_apuesta_monto
        CHECK (monto > 0)
) ENGINE=InnoDB;


-- =========================================================
-- 21. CONSULTAS DE VERIFICACION
-- =========================================================

-- Consultar todas las tablas creadas.
SHOW TABLES;

-- Consultar la estructura del aficionado.
DESCRIBE aficionado;

-- Consultar la estructura de las apuestas.
DESCRIBE apuesta;

-- Consultar las relaciones y restricciones de la base.
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'torneos_deportivos'
AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME;