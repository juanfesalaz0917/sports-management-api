-- Migración: la apuesta debe registrar el equipo elegido para poder liquidarse correctamente.
-- Las apuestas existentes quedan con NULL y se anulan (reembolso) al liquidar.
USE torneos_deportivos;

ALTER TABLE apuesta
    ADD COLUMN id_equipo_seleccionado BIGINT NULL,
    ADD CONSTRAINT fk_apuesta_equipo_seleccionado
        FOREIGN KEY (id_equipo_seleccionado)
        REFERENCES equipo(id_equipo)
        ON DELETE RESTRICT;

CREATE INDEX idx_apuesta_partido_estado ON apuesta (id_partido, estado);
