# installation

Install using npm:

```
npm install @fendy3002/qz-promise;
```

Or using yarn:

```
yarn add @fendy3002/qz-promise;
```

# Awaitable / makeAwaitable

Makes the instance of a class as Promise-able, meaning it can be used with await syntax. For example:

```javascript
const myAwaitableClass = new MyAwaitableClass();
const result = await myAwaitableClass;
```

Which is useful to enable optional chaining, like:

```javascript
const createMyAwaitable = () => new MyAwaitableClass();
const result1 = await createMyAwaitable();
const result2 = await createMyAwaitable().withName('myName');
const result3 = await createMyAwaitable().withName('myName')
  .withAddress('myAddress');
```

There are two ways to make a class to be awaitable. First is by extending from `Awaitable<T>` abstract class. Second is by implementing `1Awaitable<T>` interface then using the `makeAwaitable`.

## By extending `Awaitable<T>` abstract class

By extending `Awaitable<T>` abstract class and overriding the `onAwait` function, the class is now Promise-able. The `<T>` generic parameter here shows what type that need to be resolved when `await`-ed. See example below at how to do it:

```javascript
import { Awaitable } from '@fendy3002/qz-promise';

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
```

## By using `makeAwaitable` Higher-Order Function

In case somehow that the class need to be inherited from another class already, we can use `makeAwaitable<T>` to make it Promise-able, without needing to inherit from `Awaitable<T>`. The class needs to implement `IAwaitable<T>` interface and define the `onAwait` method like the example below:

```javascript
import { IAwaitable, makeAwaitable } from '@fendy3002/qz-promise';

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
```

Note: `makeAwaitable` is still in beta stage, and somehow the awaited result can become type `unknown` in typescript. Use `Awaitable<T>` base class if possible instead.

# delay

A simple helper to delay a process by milliseconds. Example of use:

```javascript
import { delay } from '@fendy3002/qz-promise';

const performProcess = async () => {
  // do something
  await delay(3000); // delay by 3 seconds
  // do another things
}
```

# makeRetryable

A Higher-Order Function that enables a promise handler to retry when it resulted in error. It can retry for x times, or until a duration of time has elapsed, or a combination of both (whatever faster is achieved). Example of use to enable retry of a handler for 3 times (meaning it'll run once, and will keep trying 3 more times when error):

```javascript
let executionTimes = 0;
try {
  await makeRetryable(async () => {
    executionTimes++;
    throw new Error('custom error');
  }).forTimes(3);
} catch (ex) {
  // executionTimes should be 4
}
```

Or if we want it to keep retrying for 10 seconds with 1 seconds delay in between:

```javascript
let executionTimes = 0;
try {
  await makeRetryable(async () => {
    executionTimes++;
    throw new Error('custom error');
  }).forDuration(10 * 1000) // 10 seconds
  .withDelay(1000); // 1 seconds delay
} catch (ex) {
  // execution times should be around 10 or 11 times
}
```

If we want to perform some logging or activity in between retry, we can use `onRetrying` handler:
```javascript
let executionTimes = 0;
let onRetryingTimes = 0;
try {
  await makeRetryable(async () => {
    executionTimes++;
    throw new Error('custom error');
  })
    .forTimes(3)
    .onRetrying(async () => {
      onRetryingTimes++;
      // can do logging here
    });
} catch (ex) {
  // executionTimes should be 4
  // onRetryingTimes should be 3
}
```

# inBatchOf

Process an array of handlers in batches. For example let's say we need to process 32 handlers in batches with size of 5. It will process 7 batches in total, where each batch will process 5 handlers simultaneously (and 2 handlers for the last batch).

The handler is to be defined as `() => Promise<T>`, or simply define it like `async () => something`. For example:

```javascript
import { inBatchOf } from '@fendy3002/qz-promise';

const performProcess = async () => {
  const processHandlers: (() => Promise<number>)[] = [];
  for(let i = 0; i < 32; i ++){
    processHandlers.push(async () => i);
  }
  return await inBatchOf(5)
    .process(processHandlers);
  // resulted in [0, 1, ...31]
}
```

If somehow one of the process resulted in error, it'll keep processing until all batchs are processed, and the error will be returned as result for the index. For example: 

```javascript
import { inBatchOf } from '@fendy3002/qz-promise';

const performProcess = async () => {
  const processHandlers: (() => Promise<number>)[] = [];
  for(let i = 0; i < 10; i ++){
    if(i % 2 == 0){
      processHandlers.push(async () => i);
    } else {
      processHandlers.push(async () => {
        throw new Error(`Error at ${i}`);
        return i; // unreachable code, to trick typescript
      });
    }
  }
  return await inBatchOf(2)
    .process(processHandlers);
  // resulted in [0, Error, 2, Error, ...8, Error]
}
```