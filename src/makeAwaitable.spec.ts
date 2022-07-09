import { IAwaitable } from './interface';
import { makeAwaitable } from './makeAwaitable';

interface IExecutionContext {
  executeAwait(): void;
}
class SampleTest implements IAwaitable<string> {
  constructor(private context: IExecutionContext) {}
  resultValue = 'Awaited result';
  public setResultValue(value) {
    this.resultValue = value;
    return this;
  }
  public async onAwait() {
    this.context.executeAwait();
    return this.resultValue;
  }
}
const AwaitableTest = makeAwaitable(SampleTest);

describe(`Awaitable`, () => {
  it(`it will perform await`, async () => {
    const context: IExecutionContext & any = {
      executionTimes: 0,
      executeAwait: () => context.executionTimes++,
    };
    const awaitableTest = new AwaitableTest(context);
    let result = await awaitableTest;

    expect(result).toBe('Awaited result');
    expect(context.executionTimes).toBe(1);
  });
  it(`it will perform await after setting the value`, async () => {
    const context: IExecutionContext & any = {
      executionTimes: 0,
      executeAwait: () => context.executionTimes++,
    };
    const awaitableTest = new AwaitableTest(context);
    let result = await awaitableTest.setResultValue('New await result');

    expect(result).toBe('New await result');
    expect(context.executionTimes).toBe(1);
  });

  it(`it will not await`, async () => {
    const context: IExecutionContext & any = {
      executionTimes: 0,
      executeAwait: () => context.executionTimes++,
    };
    const awaitableTest = new AwaitableTest(context);
    awaitableTest.setResultValue('New awaited result');

    expect(context.executionTimes).toBe(0);
  });
});
