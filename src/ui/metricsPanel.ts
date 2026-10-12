import { ForestStats } from "../domain/shared/IForest";
import { getEl } from "./dom";

/** Calcula los FPS promediando cada 500 ms. */
export class FpsMeter {
  private frames = 0;
  private lastTime = performance.now();
  private _fps = 0;

  public tick(now: number): void {
    this.frames++;
    const elapsed = now - this.lastTime;
    if (elapsed >= 500) {
      this._fps = (this.frames * 1000) / elapsed;
      this.frames = 0;
      this.lastTime = now;
    }
  }

  public get fps(): number {
    return this._fps;
  }
}

export interface MetricsData {
  readonly stats: ForestStats;
  readonly fps: number;
  readonly creationMs: number;
  readonly maxTrees: number;
}

export class MetricsPanel {
  private readonly trees = getEl<HTMLElement>("m-trees");
  private readonly resources = getEl<HTMLElement>("m-resources");
  private readonly buffers = getEl<HTMLElement>("m-buffers");
  private readonly memory = getEl<HTMLElement>("m-memory");
  private readonly time = getEl<HTMLElement>("m-time");
  private readonly fpsEl = getEl<HTMLElement>("m-fps");
  private readonly warning = getEl<HTMLElement>("warning");

  public update({ stats, fps, creationMs, maxTrees }: MetricsData): void {
    const fmt = (n: number): string => n.toLocaleString("es");

    this.trees.textContent = fmt(stats.treeCount);
    this.resources.textContent = fmt(stats.resourceSets);
    this.buffers.textContent = fmt(stats.bufferCount);
    this.memory.textContent = `${(stats.totalBytes / 1024 / 1024).toFixed(1)} MB`;
    this.time.textContent = `${fmt(Math.round(creationMs))} ms`;
    this.fpsEl.textContent = fps.toFixed(0);

    if (stats.treeCount >= maxTrees) {
      this.warning.textContent = `🛑 Tope de ${fmt(maxTrees)} árboles alcanzado: cada uno carga sus propios buffers.`;
    } else if (stats.treeCount >= maxTrees * 0.8) {
      this.warning.textContent = "⚠️ Cerca del tope: el consumo de memoria es muy alto.";
    } else {
      this.warning.textContent = "";
    }
  }
}