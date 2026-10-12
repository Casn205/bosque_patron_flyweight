import { getEl } from "./dom";

export type ForestMode = "debt" | "flyweight";

export interface ControlsHandlers {
  onPlant(count: number): void;
  onClear(): void;
  onModeChange(mode: ForestMode): void;
}

/** Selector de modo, slider, botones de plantar/vaciar y barra de progreso. */
export class Controls {
  private readonly slider = getEl<HTMLInputElement>("amount-slider");
  private readonly label = getEl<HTMLElement>("amount-label");
  private readonly plantBtn = getEl<HTMLButtonElement>("plant-btn");
  private readonly clearBtn = getEl<HTMLButtonElement>("clear-btn");
  private readonly presetBtns = Array.from(
    document.querySelectorAll<HTMLButtonElement>("button.preset")
  );
  private readonly modeBtns = Array.from(
    document.querySelectorAll<HTMLButtonElement>("button.mode-btn")
  );
  private readonly badge = getEl<HTMLElement>("mode-badge");
  private readonly progress = getEl<HTMLElement>("progress");
  private readonly progressBar = getEl<HTMLElement>("progress-bar");
  private readonly progressText = getEl<HTMLElement>("progress-text");

  constructor(handlers: ControlsHandlers) {
    this.slider.addEventListener("input", () => {
      this.label.textContent = Number(this.slider.value).toLocaleString("es");
    });

    this.plantBtn.addEventListener("click", () =>
      handlers.onPlant(Number(this.slider.value))
    );

    this.clearBtn.addEventListener("click", () => handlers.onClear());

    for (const btn of this.presetBtns) {
      btn.addEventListener("click", () =>
        handlers.onPlant(Number(btn.dataset.amount))
      );
    }

    for (const btn of this.modeBtns) {
      btn.addEventListener("click", () =>
        handlers.onModeChange(btn.dataset.mode as ForestMode)
      );
    }
  }

  /** Marca el botón activo y actualiza la insignia del encabezado. */
  public setMode(mode: ForestMode): void {
    for (const btn of this.modeBtns) {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    }
    const isFly = mode === "flyweight";
    this.badge.textContent = isFly
      ? "Modo: con Flyweight"
      : "Modo: sin Flyweight (deuda técnica)";
    this.badge.classList.toggle("fly", isFly);
  }

  /** Mientras se planta, se bloquean los botones de plantar (Vaciar y Modo siguen activos). */
  public setBusy(busy: boolean): void {
    this.plantBtn.disabled = busy;
    for (const btn of this.presetBtns) btn.disabled = busy;
  }

  public showProgress(done: number, total: number): void {
    this.progress.hidden = false;
    this.progressBar.style.width = `${(done / total) * 100}%`;
    this.progressText.textContent = `Plantando ${done.toLocaleString("es")} / ${total.toLocaleString("es")}`;
  }

  public hideProgress(): void {
    this.progress.hidden = true;
    this.progressBar.style.width = "0%";
  }
}