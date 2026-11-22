/** Convierte 'true'/'false' (query string) a booleano; undefined si no viene. */
export function toBoolean({ value }: { value: unknown }): boolean | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  return String(value).toLowerCase() === 'true';
}
