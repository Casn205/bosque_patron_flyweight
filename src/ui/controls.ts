import { getEl } from "./dom";

export interface ControlsHandlers {
  onPlant(count: number): void;
  onClear(): void;
}

/** Slider, botones de plantar/vaciar y barra de progreso. */
export class Controls {
  private readonly slider = getEl<HTMLInputElement>("amount-slider");
  private readonly label = getEl<HTMLElement>("amount-label");
  private readonly plantBtn = getEl<HTMLButtonElement>("plant-btn");
  private readonly clearBtn = getEl<HTMLButtonElement>("clear-btn");
  private readonly presetBtns = Array.from(
    document.querySelectorAll<HTMLButtonElement>("button.preset")
  );
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
  }

  /** Mientras se planta, se bloquean los botones de plantar (Vaciar sigue activo). */
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