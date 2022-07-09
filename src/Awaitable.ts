import { IAwaitable } from "./interface/IAwaitable";

export abstract class Awaitable<T> implements IAwaitable<T> {
  abstract onAwait(): Promise<void | T>;
  then(handler) {
    return this.onAwait().then(handler);
  }
};