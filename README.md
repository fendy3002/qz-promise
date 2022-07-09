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
const result1 = await createMyAwaitable();
const result2 = await createMyAwaitable().withName('myName');
const result3 = await createMyAwaitable().withName('myName')
  .withAddress('myAddress');
```

## By extending `Awaitable` abstract class

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

# makeRetryable

# inBatchOf