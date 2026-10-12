import { Species } from "../shared/Species";
import { TreeType } from "./TreeType";

/**
 * FLYWEIGHT FACTORY.
 * Garantiza que exista un solo TreeType por especie:
 * si ya existe lo reutiliza, si no, lo crea y lo guarda en caché.
 */
export class TreeTypeFactory {
  private readonly types = new Map<Species, TreeType>();

  public getType(species: Species): TreeType {
    let type = this.types.get(species);
    if (!type) {
      type = new TreeType(species);
      this.types.set(species, type);
    }
    return type;
  }

  /** Cantidad de flyweights distintos en memoria. */
  public count(): number {
    return this.types.size;
  }

  /** Vacía la caché para que el GC libere los buffers. */
  public clear(): void {
    this.types.clear();
  }
}