-- HU-GC-10: desactivación histórica de asociaciones de pago
ALTER TABLE metodo_pago_aficionado
  ADD COLUMN IF NOT EXISTS activo TINYINT(1) NOT NULL DEFAULT 1 AFTER referencia;

ALTER TABLE metodo_pago
  ADD COLUMN IF NOT EXISTS activo TINYINT(1) NOT NULL DEFAULT 1 AFTER descripcion;

ALTER TABLE metodo_pago_aficionado
  ADD INDEX IF NOT EXISTS idx_mpa_aficionado_metodo (id_aficionado, id_metodo_pago);
