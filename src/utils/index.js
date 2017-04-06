// @flow

export class Observable<T> {
  listeners: Set<(value: T) => void> = new Set;
  publish(value: T) { for (const listener of this.listeners) listener(value); }
  subscribe(listener: (value: T) => void){ this.listeners.add(listener); }
  unsubscribe(listener: (value: T) => void){ this.listeners.delete(listener); }
}
