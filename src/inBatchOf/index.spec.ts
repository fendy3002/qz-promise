import { delay } from '../delay';
import { inBatchOf } from './index';

describe(`inBatchOf`, () => {
  it(`it will execute 19 process in batch of 5, 4 loop`, async () => {
    let batchNumber = 0;
    const batchProcesses: (() => Promise<string>)[] = [];
    const expectedResult = [];
    for (let i = 0; i < 19; i++) {
      batchProcesses.push(async () => {
        await delay(10);
        return i.toString();
      });
      expectedResult.push(i.toString());
    }
    const startTs = new Date().getTime();
    const batchProcessor = inBatchOf(5)
      .process<string>(batchProcesses)
      .onBatchProcessed(async (batchIndex, batchResult) => {
        batchNumber++;
        expect(batchResult.length).toBeLessThanOrEqual(5);
      });
    const result = await batchProcessor;

    expect(result.length).toBe(19);
    expect(batchNumber).toBe(4);
    expect(result).toEqual(expectedResult);
    // 80 to be safe, should be around 40-60ish due to jit
    expect(new Date().getTime() - startTs).toBeLessThanOrEqual(80);
  });

  it(`it will execute 19 process in batch of 5, 4 loop with some error in between`, async () => {
    let batchNumber = 0;
    const batchProcesses: (() => Promise<string>)[] = [];
    const expectedResult = [];
    for (let i = 0; i < 19; i++) {
      batchProcesses.push(async () => {
        await delay(10);
        if (i % 4 == 0) {
          throw new Error('custom error ' + i.toString());
        }
        return i.toString();
      });
      if (i % 4 == 0) {
        expectedResult.push(new Error('custom error ' + i.toString()));
      } else {
        expectedResult.push(i.toString());
      }
    }
    const startTs = new Date().getTime();
    const batchProcessor = inBatchOf(5)
      .process<string>(batchProcesses)
      .onBatchProcessed(async (batchIndex, batchResult) => {
        batchNumber++;
        expect(batchResult.length).toBeLessThanOrEqual(5);
      });
    const result = await batchProcessor;

    expect(result.length).toBe(19);
    expect(batchNumber).toBe(4);
    expect(result).toEqual(expectedResult);
    // 80 to be safe, should be around 40-60ish due to jit
    expect(new Date().getTime() - startTs).toBeLessThanOrEqual(80);
  });
});
