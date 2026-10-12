import { IRenderableTree } from "../domain/shared/IForest";
import { Species, SPECIES_LIST } from "../domain/shared/Species";

const BACKGROUND = "#0d2412";

/** Formas unitarias (radio 1) centradas en el origen, una por especie. */
function buildShapes(): Record<Species, Path2D> {
  const pino = new Path2D();
  pino.moveTo(0, -1);
  pino.lineTo(0.85, 0.8);
  pino.lineTo(-0.85, 0.8);
  pino.closePath();

  const roble = new Path2D();
  roble.arc(0, 0, 1, 0, Math.PI * 2);

  const abedul = new Path2D();
  abedul.ellipse(0, 0, 0.55, 1, 0, 0, Math.PI * 2);

  const palmera = new Path2D();
  for (let i = 0; i < 12; i++) {
    const radius = i % 2 === 0 ? 1 : 0.35;
    const angle = (i * Math.PI) / 6 - Math.PI / 2;
    const px = Math.cos(angle) * radius;
    const py = Math.sin(angle) * radius;
    if (i === 0) palmera.moveTo(px, py);
    else palmera.lineTo(px, py);
  }
  palmera.closePath();

  return { pino, roble, abedul, palmera };
}

/**
 * Dibuja el bosque en Canvas. Solo conoce IRenderableTree,
 * así que funcionará igual con la versión Flyweight.
 */
export class Renderer {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly shapes = buildShapes();
  private pxPerUnit = 1;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly worldSize: number
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D no disponible");
    this.ctx = ctx;
    this.resize();
  }

  /** Ajusta la resolución interna al tamaño visible (y a pantallas HiDPI). */
  public resize(): void {
    const dpr = window.devicePixelRatio || 1;
    const size = Math.max(1, Math.round(this.canvas.clientWidth * dpr));
    this.canvas.width = size;
    this.canvas.height = size;
    this.pxPerUnit = size / this.worldSize;
  }

  public render(trees: readonly IRenderableTree[], timeSeconds: number): void {
    const { ctx } = this;
    const k = this.pxPerUnit;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Una pasada por especie para cambiar fillStyle solo 4 veces por frame
    for (const species of SPECIES_LIST) {
      const shape = this.shapes[species];
      let colorSet = false;

      for (const tree of trees) {
        if (tree.species !== species) continue;
        if (!colorSet) {
          ctx.fillStyle = tree.leafColor;
          colorSet = true;
        }

        const radius = tree.baseHeight * tree.scale * 0.55 * k;
        // Viento: oscilación de ángulo y desplazamiento, desfasada por árbol
        const angle =
          tree.rotation + Math.sin(timeSeconds * 1.8 + tree.windPhase) * 0.25;
        const sway = Math.sin(timeSeconds * 1.2 + tree.windPhase) * 0.5 * radius;
        const c = Math.cos(angle) * radius;
        const s = Math.sin(angle) * radius;

        ctx.setTransform(c, s, -s, c, tree.x * k + sway, tree.y * k);
        ctx.fill(shape);
      }
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}