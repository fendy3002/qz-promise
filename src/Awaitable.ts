import { IAwaitable } from './interface/IAwaitable';

export abstract class Awaitable<T> implements IAwaitable<T>, Promise<T> {
  abstract onAwait(): Promise<T>;

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined,
  ): Promise<TResult1 | TResult2> {
    return this.onAwait().then(onfulfilled).catch(onrejected);
  }

  catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | null
      | undefined,
  ): Promise<T | TResult> {
    return this.onAwait().catch(onrejected);
  }

  finally(onfinally?: (() => void) | null | undefined): Promise<T> {
    return this.onAwait().finally(() => {
      return onfinally?.();
    });
  }
  get [Symbol.toStringTag]() {
    return 'Awaitable';
  }
}
