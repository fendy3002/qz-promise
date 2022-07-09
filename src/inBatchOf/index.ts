import { InBatchOf } from './InBatchOf';

export const inBatchOf = (batchLimit: number) => {
  return {
    process: <T>(handles: (() => Promise<T>)[]) => {
      return new InBatchOf<T>(batchLimit, handles);
    },
  };
};
