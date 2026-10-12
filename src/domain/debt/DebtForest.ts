import { SPECIES_LIST } from "../shared/Species";
import { byteCounter } from "../shared/ByteCounter";
import { ForestStats, IForest, IRenderableTree } from "../shared/IForest";
import { Tree } from "./Tree";

/**
 * Bosque sin Flyweight: cada Tree es un objeto gordo con buffers propios.
 */
export class DebtForest implements IForest {
  private _trees: Tree[] = [];

  /** @param worldSize lado del mundo cuadrado (en unidades de mundo). */
  constructor(private readonly worldSize: number = 1000) {}

  public get trees(): readonly IRenderableTree[] {
    return this._trees;
  }

  public plant(count: number): void {
    for (let i = 0; i < count; i++) {
      const species =
        SPECIES_LIST[Math.floor(Math.random() * SPECIES_LIST.length)];
      this._trees.push(
        new Tree(
          species,
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
    this._trees = []; // suelta las referencias para que el GC libere los buffers
    byteCounter.reset();
  }

  public stats(): ForestStats {
    return {
      treeCount: this._trees.length,
      // Sin Flyweight: un conjunto mesh+texture POR árbol
      resourceSets: this._trees.length,
      bufferCount: byteCounter.bufferCount,
      totalBytes: byteCounter.totalBytes,
    };
  }
}