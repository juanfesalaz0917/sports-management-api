-- =========================================================
-- RESET DE DATOS - torneos_deportivos
-- Vacia TODAS las tablas (sin borrarlas) y reinicia los
-- AUTO_INCREMENT a 1. Detecta las tablas dinamicamente, asi
-- incluye tambien las que no estan en el DDL (ej. grupo_equipo).
-- Uso:
--   mysql -u mostro -p torneos_deportivos < reset-datos.sql
--   mysql -u mostro -p torneos_deportivos < seed-datos-prueba.sql
-- =========================================================
USE torneos_deportivos;

SET FOREIGN_KEY_CHECKS = 0;

DROP PROCEDURE IF EXISTS sp_reset_datos;
DELIMITER $$
CREATE PROCEDURE sp_reset_datos()
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE t VARCHAR(128);
  DECLARE cur CURSOR FOR
    SELECT table_name FROM information_schema.tables
     WHERE table_schema = 'torneos_deportivos' AND table_type = 'BASE TABLE';
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN cur;
  lectura: LOOP
    FETCH cur INTO t;
    IF done = 1 THEN LEAVE lectura; END IF;
    SET @stmt = CONCAT('TRUNCATE TABLE `', t, '`');
    PREPARE s FROM @stmt;
    EXECUTE s;
    DEALLOCATE PREPARE s;
  END LOOP;
  CLOSE cur;
END$$
DELIMITER ;

CALL sp_reset_datos();
DROP PROCEDURE sp_reset_datos;

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Datos reiniciados: todas las tablas quedaron vacias.' AS resultado;
