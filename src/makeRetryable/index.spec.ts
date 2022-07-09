import { makeRetryable } from '.';
import { delay } from '../delay';

describe(`makeRetryable`, () => {
  it(`it will do once and retry 3 times`, async () => {
    let executionTimes = 0;
    expect.hasAssertions();
    try {
      await makeRetryable(async () => {
        executionTimes++;
        throw new Error('custom error');
      }).forTimes(3);
    } catch (ex) {
      expect(executionTimes).toBe(4);
      expect(ex.message).toBe('custom error');
    }
  });
  it(`will keep retry for 1 seconds`, async () => {
    let executionTimes = 0;
    expect.hasAssertions();
    try {
      await makeRetryable(async () => {
        executionTimes++;
        await delay(101);
        throw new Error('custom error');
      }).forDuration(1 * 1000);
    } catch (ex) {
      expect(executionTimes).toBe(10);
      expect(ex.message).toBe('custom error');
    }
  });
  it(`it will do a 10ms process and retry 3 times with 10ms delay in between`, async () => {
    let executionTimes = 0;
    expect.hasAssertions();
    const nowTs = new Date().getTime();
    try {
      await makeRetryable(async () => {
        executionTimes++;
        await delay(10);
        throw new Error('custom error');
      })
        .forTimes(3)
        .withDelay(10);
    } catch (ex) {
      expect(executionTimes).toBe(4);
      expect(ex.message).toBe('custom error');
      expect(nowTs).toBeGreaterThanOrEqual(80);
    }
  });
});
