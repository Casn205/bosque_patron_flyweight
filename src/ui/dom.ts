/** Obtiene un elemento por id o falla con un mensaje claro. */
export function getEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`No existe el elemento #${id} en el HTML`);
  }
  return el as T;
}