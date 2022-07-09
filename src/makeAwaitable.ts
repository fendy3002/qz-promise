import { IAwaitable } from './interface';

type Constructable<T> = new (...args: any[]) => T;

export const makeAwaitable = <T, BC extends Constructable<IAwaitable<T>>>(
  BaseClass: BC,
) => {
  return class extends BaseClass implements Promise<T> {
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>,
      onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>,
    ): Promise<TResult1 | TResult2> {
      return this.onAwait().then(onfulfilled).catch(onrejected);
    }
    catch<TResult = never>(
      onrejected?: (reason: any) => TResult | PromiseLike<TResult>,
    ): Promise<T | TResult> {
      return this.onAwait().catch(onrejected);
    }
    finally(onfinally?: () => void): Promise<T> {
      return this.onAwait().finally(() => {
        return onfinally?.();
      });
    }

    get [Symbol.toStringTag]() {
      return 'Awaitable';
    }
  };
};
