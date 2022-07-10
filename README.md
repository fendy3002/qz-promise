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

<details>
  <summary>Show example</summary>
  
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
</details>

## By using `makeAwaitable` function

In case somehow that the class need to be inherited from another class already, we can use `makeAwaitable<T>` to make it Promise-able, without needing to inherit from `Awaitable<T>`. The class needs to implement `IAwaitable<T>` interface and define the `onAwait` method like the example below:

<details>
  <summary>Show example</summary>
  
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
</details>

# delay

A simple helper to delay a process by milliseconds. Example of use:

<details>
  <summary>Show example</summary>
  
  ```javascript
  import { delay } from '@fendy3002/qz-promise';

  const performProcess = async () => {
    // do something
    await delay(3000); // delay by 3 seconds
    // do another things
  }
  ```
</details>

# makeRetryable


# inBatchOf

Process an array of handlers in batches. For example let's say we need to process 32 handlers in batches with size of 5. It will process 7 batches in total, where each batch will process 5 handlers simultaneously (and 2 handlers for the last batch).

The handler is to be defined as `() => Promise<T>`, or simply define it like `async () => something`. For example:

<details>
  <summary>Show example</summary>
  
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
</details>

If somehow one of the process resulted in error, it'll keep processing until all batchs are processed, and the error will be returned as result for the index. For example: 

<details>
  <summary>Show example</summary>
  
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
</details>