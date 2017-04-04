// @flow

export class Observable<T> extends Set<(value: T) => void>{
  publish = (value: T) => {
    for (const listener of this) listener(value);
  }
}
