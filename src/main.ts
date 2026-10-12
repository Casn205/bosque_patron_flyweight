import { IForest } from "./domain/shared/IForest";
import { SPECIES_CONFIG, SPECIES_LIST } from "./domain/shared/Species";
import { DebtForest } from "./domain/debt/DebtForest";
import { FlyweightForest } from "./domain/flyweight/FlyweightForest";
import { Renderer } from "./ui/renderer";
import { Controls, ForestMode } from "./ui/controls";
import { FpsMeter, MetricsPanel } from "./ui/metricsPanel";
import { getEl } from "./ui/dom";

const WORLD_SIZE = 1000;
const MAX_TREES = 5000;
/** Tiempo máximo por frame dedicado a plantar, para no congelar la página. */
const FRAME_BUDGET_MS = 12;

/** Única línea que conoce las implementaciones concretas. */
function createForest(mode: ForestMode): IForest {
  return mode === "debt"
    ? new DebtForest(WORLD_SIZE)
    : new FlyweightForest(WORLD_SIZE);
}

let mode: ForestMode = "debt";
let forest: IForest = createForest(mode);

const renderer = new Renderer(getEl<HTMLCanvasElement>("forest-canvas"), WORLD_SIZE);
const metrics = new MetricsPanel();
const fps = new FpsMeter();

// Estado del trabajo de plantado por lotes
let pending = 0; // árboles que faltan por plantar
let jobTotal = 0;
let jobDone = 0;
let creationMs = 0; // tiempo acumulado dentro de forest.plant()

const controls = new Controls({
  onPlant: requestPlant,
  onClear: clearForest,
  onModeChange: changeMode,
});

function requestPlant(count: number): void {
  const room = MAX_TREES - forest.trees.length - pending;
  const amount = Math.min(count, room);
  if (amount <= 0) return;

  pending += amount;
  jobTotal += amount;
  controls.setBusy(true);
}

function clearForest(): void {
  pending = 0;
  jobTotal = 0;
  jobDone = 0;
  creationMs = 0;
  forest.clear();
  controls.hideProgress();
  controls.setBusy(false);
}

/**
 * Cambia de implementación y vuelve a plantar la misma cantidad de árboles,
 * para que las métricas de ambos modos sean comparables.
 */
function changeMode(next: ForestMode): void {
  if (next === mode) return;

  const count = forest.trees.length + pending;
  clearForest(); // libera el bosque anterior y reinicia el contador de bytes

  mode = next;
  forest = createForest(mode);
  controls.setMode(mode);

  if (count > 0) requestPlant(count);
}

/** Planta árboles de uno en uno hasta agotar el presupuesto de tiempo del frame. */
function plantStep(): void {
  const start = performance.now();
  do {
    forest.plant(1);
    pending--;
    jobDone++;
  } while (pending > 0 && performance.now() - start < FRAME_BUDGET_MS);

  creationMs += performance.now() - start;
  controls.showProgress(jobDone, jobTotal);

  if (pending === 0) {
    jobTotal = 0;
    jobDone = 0;
    controls.hideProgress();
    controls.setBusy(false);
  }
}

function frame(now: number): void {
  if (pending > 0) plantStep();

  renderer.render(forest.trees, now / 1000);
  fps.tick(now);
  metrics.update({
    stats: forest.stats(),
    fps: fps.fps,
    creationMs,
    maxTrees: MAX_TREES,
    mode,
  });

  requestAnimationFrame(frame);
}

function buildLegend(): void {
  const legend = getEl<HTMLElement>("legend");
  for (const species of SPECIES_LIST) {
    const item = document.createElement("span");
    const dot = document.createElement("i");
    dot.style.background = SPECIES_CONFIG[species].leafColor;
    item.append(dot, species);
    legend.append(item);
  }
}

window.addEventListener("resize", () => renderer.resize());
buildLegend();
controls.setMode(mode);
requestAnimationFrame(frame);