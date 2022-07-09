import {Awaitable} from './Awaitable';

class AwaitableTest extends Awaitable<string> {
  override async onAwait() {
    return "Awaited result";
  }
}

describe(`Awaitable`, () => {
  it(`it will perform await`, async() => {
    const awaitableTest = new AwaitableTest();
  })
})