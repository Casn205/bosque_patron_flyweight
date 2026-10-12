import { Species } from "./Species";

/**
 * Lo único que el renderer necesita saber de un árbol.
 * Ambas versiones (debt y flyweight) la implementan.
 */
export interface IRenderableTree {
  readonly species: Species;
  readonly leafColor: string;
  readonly baseHeight: number;
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly rotation: number;
  readonly windPhase: number;
}

export interface ForestStats {
  /** Árboles en el bosque. */
  readonly treeCount: number;
  /** Conjuntos mesh+texture distintos que existen en memoria. */
  readonly resourceSets: number;
  /** Buffers pesados creados (mesh + texture). */
  readonly bufferCount: number;
  /** Bytes totales de buffers creados. */
  readonly totalBytes: number;
}

/** Contrato común: la UI no sabe qué versión está usando. */
export interface IForest {
  readonly trees: readonly IRenderableTree[];
  plant(count: number): void;
  clear(): void;
  stats(): ForestStats;
}