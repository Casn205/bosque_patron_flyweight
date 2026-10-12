import { Species, SPECIES_CONFIG } from "../shared/Species";
import { loadMesh, loadTexture } from "../shared/resources";
import { IRenderableTree } from "../shared/IForest";

/**
 * DEUDA TÉCNICA:
 * Esta clase mezcla estado intrínseco (species, leafColor, baseHeight,
 * mesh, texture) con estado extrínseco (x, y, scale, rotation, windPhase).
 * Cada instancia carga y guarda sus PROPIOS buffers, aunque sean idénticos
 * para todos los árboles de la misma especie.
 */
export class Tree implements IRenderableTree {
  // --- Estado intrínseco (repetido en cada árbol) ---
  public readonly species: Species;
  public readonly leafColor: string;
  public readonly baseHeight: number;
  public readonly mesh: Float32Array; // ~60 KB duplicados
  public readonly texture: Uint8Array; // ~64 KB duplicados

  // --- Estado extrínseco (único por árbol) ---
  public x: number;
  public y: number;
  public scale: number;
  public rotation: number; // radianes
  public windPhase: number; // radianes, desfasa el balanceo de cada árbol

  constructor(
    species: Species,
    x: number,
    y: number,
    scale: number,
    rotation: number,
    windPhase: number
  ) {
    const config = SPECIES_CONFIG[species];

    this.species = species;
    this.leafColor = config.leafColor;
    this.baseHeight = config.baseHeight;

    // Cada árbol "lee del disco" sus propios recursos
    this.mesh = loadMesh(species);
    this.texture = loadTexture(species);

    this.x = x;
    this.y = y;
    this.scale = scale;
    this.rotation = rotation;
    this.windPhase = windPhase;
  }

  /**
   * Dibujo simulado: usa datos intrínsecos y extrínsecos.
   * Representa el uso de los recursos pesados que haría un motor real.
   * (El dibujo visible en pantalla lo hace el renderer de Canvas.)
   */
  public draw(): number {
    const height = this.baseHeight * this.scale;
    return (
      this.mesh[0] + this.texture[0] + this.x + this.y + height + this.rotation
    );
  }
}