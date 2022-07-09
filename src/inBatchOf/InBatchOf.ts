import { Awaitable } from '../Awaitable';

export class InBatchOf<T> extends Awaitable<(T | Error)[]> {
  constructor(
    private batchLimit: number,
    private handles: (() => Promise<T>)[],
  ) {
    super();
  }
  private onBatchProcessedHandle: (
    batchIndex: number,
    batchResult: (T | Error)[],
  ) => void = null;
  onBatchProcessed(
    handle: (batchIndex: number, batchResult: (T | Error)[]) => void,
  ) {
    this.onBatchProcessedHandle = handle;
    return this;
  }

  async onAwait(): Promise<(T | Error)[]> {
    const result: (T | Error)[] = [];
    const numberOfBatch = Math.ceil(this.handles.length / this.batchLimit);
    for (let batchIndex = 0; batchIndex < numberOfBatch; batchIndex++) {
      const batchResult = await Promise.all(
        this.handles
          .slice(
            batchIndex * this.batchLimit,
            batchIndex * this.batchLimit + this.batchLimit,
          )
          .map(async (handle) => {
            try {
              return await handle();
            } catch (ex) {
              return ex;
            }
          }),
      );
      if (this.onBatchProcessedHandle) {
        await this.onBatchProcessedHandle(batchIndex, batchResult);
      }
      result.push(...batchResult);
    }
    return result;
  }
}
