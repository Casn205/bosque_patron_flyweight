import { SPECIES_LIST } from "../shared/Species";
import { byteCounter } from "../shared/ByteCounter";
import { ForestStats, IForest, IRenderableTree } from "../shared/IForest";
import { TreeTypeFactory } from "./TreeTypeFactory";
import { Tree } from "./Tree";

/**
 * CLIENT.
 * Pide los flyweights a la fábrica y crea árboles livianos que los referencian.
 */
export class FlyweightForest implements IForest {
  private _trees: Tree[] = [];
  private readonly factory = new TreeTypeFactory();

  /** @param worldSize lado del mundo cuadrado (en unidades de mundo). */
  constructor(private readonly worldSize: number = 1000) {}

  public get trees(): readonly IRenderableTree[] {
    return this._trees;
  }

  public plant(count: number): void {
    for (let i = 0; i < count; i++) {
      const species =
        SPECIES_LIST[Math.floor(Math.random() * SPECIES_LIST.length)];
      // Mismo código que DebtForest, salvo esta línea: se reutiliza el tipo
      const type = this.factory.getType(species);

      this._trees.push(
        new Tree(
          type,
          Math.random() * this.worldSize, // x
          Math.random() * this.worldSize, // y
          0.8 + Math.random() * 0.4, // scale
          Math.random() * Math.PI * 2, // rotation
          Math.random() * Math.PI * 2 // windPhase
        )
      );
    }
  }

  public clear(): void {
    this._trees = [];
    this.factory.clear(); // si no se vacía la caché, los buffers nunca se liberan
    byteCounter.reset();
  }

  public stats(): ForestStats {
    return {
      treeCount: this._trees.length,
      // Con Flyweight: como máximo uno por especie
      resourceSets: this.factory.count(),
      bufferCount: byteCounter.bufferCount,
      totalBytes: byteCounter.totalBytes,
    };
  }
}