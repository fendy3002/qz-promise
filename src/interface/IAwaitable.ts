export interface IAwaitable<T> {
  onAwait(): Promise<T | void>;
}
