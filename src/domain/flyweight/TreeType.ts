import { Species, SPECIES_CONFIG } from "../shared/Species";
import { loadMesh, loadTexture } from "../shared/resources";

/**
 * Estado EXTRÍNSECO: único por árbol. No vive dentro del flyweight,
 * se le pasa como parámetro en cada operación.
 */
export interface ExtrinsicState {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly rotation: number;
  readonly windPhase: number;
}

/**
 * FLYWEIGHT.
 * Guarda solo el estado INTRÍNSECO (inmutable y compartido):
 * especie, color, altura base y los buffers pesados.
 * Existe una única instancia por especie.
 */
export class TreeType {
  public readonly species: Species;
  public readonly leafColor: string;
  public readonly baseHeight: number;
  public readonly mesh: Float32Array; // ~60 KB, UNA sola vez por especie
  public readonly texture: Uint8Array; // ~64 KB, UNA sola vez por especie

  constructor(species: Species) {
    const config = SPECIES_CONFIG[species];

    this.species = species;
    this.leafColor = config.leafColor;
    this.baseHeight = config.baseHeight;

    this.mesh = loadMesh(species);
    this.texture = loadTexture(species);
  }

  /**
   * Dibujo simulado: combina el estado intrínseco (this)
   * con el extrínseco (parámetro).
   */
  public draw(extrinsic: ExtrinsicState): number {
    const height = this.baseHeight * extrinsic.scale;
    return (
      this.mesh[0] +
      this.texture[0] +
      extrinsic.x +
      extrinsic.y +
      height +
      extrinsic.rotation
    );
  }
}