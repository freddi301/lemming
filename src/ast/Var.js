// @flow

import { Ast } from './Ast';

export class Var extends Ast {
  name: string;
  constructor({ name }: { name: string }) {
    super();
    this.name = name;
  }
  toLambda() {
    return new Var({ name: this.name });
  }
  equals(otherVar: Var): boolean { return this.name === otherVar.name; }
  static defaultNewNode = () => new Var({ name: 'x' });
  toJSON() {
    return { type: 'Var', name: this.name };
  }
  static fromJSON(o: Object): Var {
    return new Var({ name: o.name });
  }
  toString() {
    return this.name;
  }
}

Ast.jsonParsers.Var = Var.fromJSON;
