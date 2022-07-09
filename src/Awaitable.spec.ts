import { Awaitable } from './Awaitable';

interface IExecutionContext {
  executeAwait(): void;
}
class AwaitableTest extends Awaitable<string> {
  constructor(private context: IExecutionContext) {
    super();
  }
  resultValue = 'Awaited result';
  setResultValue(value) {
    this.resultValue = value;
    return this;
  }
  override async onAwait() {
    this.context.executeAwait();
    return this.resultValue;
  }
}
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
