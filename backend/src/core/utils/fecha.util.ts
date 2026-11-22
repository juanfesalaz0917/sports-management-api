/** Fecha de hoy en formato YYYY-MM-DD (comparable como texto con columnas DATE). */
export function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}
