/**
 * Lleva la cuenta de los buffers pesados que se han creado.
 * Es nuestra métrica de memoria: exacta y determinista,
 * a diferencia de performance.memory.
 */
export class ByteCounter {
  private _totalBytes = 0;
  private _bufferCount = 0;

  public add(bytes: number): void {
    this._totalBytes += bytes;
    this._bufferCount += 1;
  }

  public reset(): void {
    this._totalBytes = 0;
    this._bufferCount = 0;
  }

  public get totalBytes(): number {
    return this._totalBytes;
  }

  public get totalMB(): number {
    return this._totalBytes / 1024 / 1024;
  }

  public get bufferCount(): number {
    return this._bufferCount;
  }
}

/** Instancia única compartida por todo el dominio. */
export const byteCounter = new ByteCounter();