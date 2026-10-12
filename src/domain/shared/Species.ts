export type Species = "pino" | "roble" | "abedul" | "palmera";

export const SPECIES_LIST: readonly Species[] = [
  "pino",
  "roble",
  "abedul",
  "palmera",
];

export interface SpeciesConfig {
  /** Color de las hojas (CSS). */
  readonly leafColor: string;
  /** Color base RGB usado para generar la textura simulada. */
  readonly textureRGB: readonly [number, number, number];
  /** Altura base del árbol, sin escala. */
  readonly baseHeight: number;
}

/**
 * Datos de cada especie. Ambas versiones (debt y flyweight)
 * leen de aquí, así la comparación es justa.
 */
export const SPECIES_CONFIG: Readonly<Record<Species, SpeciesConfig>> = {
  pino: { leafColor: "#1e6432", textureRGB: [30, 100, 50], baseHeight: 12 },
  roble: { leafColor: "#3c8228", textureRGB: [60, 130, 40], baseHeight: 9 },
  abedul: { leafColor: "#8caa5a", textureRGB: [140, 170, 90], baseHeight: 7 },
  palmera: { leafColor: "#32a050", textureRGB: [50, 160, 80], baseHeight: 10 },
};