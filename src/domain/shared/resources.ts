import { Species, SPECIES_LIST, SPECIES_CONFIG } from "./Species";
import { byteCounter } from "./ByteCounter";

const VERTEX_COUNT = 5000; // 5000 * 3 floats * 4 bytes ≈ 60 KB
const TEXTURE_SIZE = 128; // 128 * 128 * 4 bytes (RGBA) ≈ 64 KB

/** Generador pseudoaleatorio determinista (resultados reproducibles). */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/**
 * Simula la carga de una malla 3D desde disco.
 * Cada llamada genera un buffer NUEVO y lo registra en el contador.
 */
export function loadMesh(species: Species): Float32Array {
  const mesh = new Float32Array(VERTEX_COUNT * 3);
  const random = seededRandom(SPECIES_LIST.indexOf(species) + 1);
  for (let i = 0; i < mesh.length; i++) {
    mesh[i] = random() * 10;
  }
  byteCounter.add(mesh.byteLength);
  return mesh;
}

/**
 * Simula la carga de una textura desde disco.
 * Cada llamada genera un buffer NUEVO y lo registra en el contador.
 */
export function loadTexture(species: Species): Uint8Array {
  const texture = new Uint8Array(TEXTURE_SIZE * TEXTURE_SIZE * 4);
  const [r, g, b] = SPECIES_CONFIG[species].textureRGB;
  const random = seededRandom(SPECIES_LIST.indexOf(species) + 100);
  const clamp = (v: number): number => Math.max(0, Math.min(255, v));
  for (let i = 0; i < texture.length; i += 4) {
    const variation = Math.floor(random() * 30) - 15;
    texture[i] = clamp(r + variation);
    texture[i + 1] = clamp(g + variation);
    texture[i + 2] = clamp(b + variation);
    texture[i + 3] = 255;
  }
  byteCounter.add(texture.byteLength);
  return texture;
}