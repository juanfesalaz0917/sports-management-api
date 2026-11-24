-- HU-GC-09: persistencia de posiciones espaciales
ALTER TABLE posicion_espacial
  ADD COLUMN IF NOT EXISTS id_partido BIGINT NULL AFTER descripcion,
  ADD COLUMN IF NOT EXISTS id_jugador BIGINT NULL AFTER id_partido,
  ADD COLUMN IF NOT EXISTS id_pelota BIGINT NULL AFTER id_jugador,
  ADD COLUMN IF NOT EXISTS es_pelota TINYINT(1) NOT NULL DEFAULT 0 AFTER id_pelota,
  ADD COLUMN IF NOT EXISTS x DECIMAL(8,4) NULL AFTER es_pelota,
  ADD COLUMN IF NOT EXISTS y DECIMAL(8,4) NULL AFTER x,
  ADD COLUMN IF NOT EXISTS timestamp DATETIME(3) NULL AFTER y;

UPDATE posicion_espacial SET timestamp = COALESCE(timestamp, NOW(3));
ALTER TABLE posicion_espacial MODIFY timestamp DATETIME(3) NOT NULL;
ALTER TABLE posicion_espacial ADD INDEX IF NOT EXISTS idx_posicion_partido_timestamp (id_partido, timestamp);
ALTER TABLE posicion_espacial ADD INDEX IF NOT EXISTS idx_posicion_jugador_timestamp (id_jugador, timestamp);
