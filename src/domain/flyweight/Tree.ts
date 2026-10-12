import { Species } from "../shared/Species";
import { IRenderableTree } from "../shared/IForest";
import { ExtrinsicState, TreeType } from "./TreeType";

/**
 * CONTEXT.
 * Solo guarda el estado extrínseco y una REFERENCIA al flyweight.
 * Los datos pesados no se copian: se leen a través de `type`.
 */
export class Tree implements IRenderableTree, ExtrinsicState {
  // Referencia compartida (8 bytes), no una copia de los buffers
  private readonly type: TreeType;

  // --- Estado extrínseco (único por árbol) ---
  public x: number;
  public y: number;
  public scale: number;
  public rotation: number;
  public windPhase: number;

  constructor(
    type: TreeType,
    x: number,
    y: number,
    scale: number,
    rotation: number,
    windPhase: number
  ) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.rotation = rotation;
    this.windPhase = windPhase;
  }

  // --- Estado intrínseco: se delega en el flyweight ---
  public get species(): Species {
    return this.type.species;
  }

  public get leafColor(): string {
    return this.type.leafColor;
  }

  public get baseHeight(): number {
    return this.type.baseHeight;
  }

  public draw(): number {
    return this.type.draw(this);
  }
}