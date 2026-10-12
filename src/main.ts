import { IForest } from "./domain/shared/IForest";
import { SPECIES_CONFIG, SPECIES_LIST } from "./domain/shared/Species";
import { DebtForest } from "./domain/debt/DebtForest";
import { Renderer } from "./ui/renderer";
import { Controls } from "./ui/controls";
import { FpsMeter, MetricsPanel } from "./ui/metricsPanel";
import { getEl } from "./ui/dom";

const WORLD_SIZE = 1000;
const MAX_TREES = 5000;
/** Tiempo máximo por frame dedicado a plantar, para no congelar la página. */
const FRAME_BUDGET_MS = 12;

// La UI solo conoce IForest: en la entrega 3 se cambiará la implementación.
const forest: IForest = new DebtForest(WORLD_SIZE);

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
requestAnimationFrame(frame);