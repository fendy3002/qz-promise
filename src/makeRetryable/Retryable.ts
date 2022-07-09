import { delay } from '../delay';
import { IAwaitable } from '../interface';
import { makeAwaitable } from '../makeAwaitable';

export class BaseRetryable<T> implements IAwaitable<T> {
  constructor(private handler: () => Promise<T>) {}
  private limitTimes = 0;
  private limitDuration = 0;
  private retryDelay = 0;

  forTimes(times) {
    this.limitTimes = times;
    return this;
  }
  withDelay(delay) {
    this.retryDelay = delay;
    return this;
  }
  forDuration(duration) {
    this.limitDuration = duration;
    return this;
  }

  private canRetry(retryTimes, elapsed) {
    let result = true;
    if (this.limitTimes == 0 && this.limitDuration == 0) {
      return false;
    }
    if (this.limitTimes > 0 && retryTimes > this.limitTimes) {
      result = false;
    }
    if (this.limitDuration > 0 && elapsed > this.limitDuration) {
      result = false;
    }
    return result;
  }

  async onAwait(): Promise<T> {
    const startTs = new Date().getTime();
    let elapsed = 0;
    let retryTimes = 0;
    let lastErr = null;
    while (this.canRetry(retryTimes, elapsed)) {
      try {
        return await this.handler();
      } catch (ex: any) {
        lastErr = ex;

        if (this.retryDelay > 0) {
          await delay(this.retryDelay);
        }
        retryTimes++;
        elapsed = new Date().getTime() - startTs;
      }
    }
    throw lastErr;
  }
}

export const Retryable = makeAwaitable(BaseRetryable);
