import { Retryable } from './Retryable';

export const makeRetryable = <T>(handler: () => Promise<T>) => {
  return new Retryable<T>(handler);
};
